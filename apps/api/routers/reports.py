import io
import json
import time
import uuid
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, File, HTTPException, Query, Request, UploadFile
from fastapi.responses import PlainTextResponse
from pydantic import BaseModel

try:  # Optional heavy dependency for PDF parsing
    import fitz  # type: ignore  # PyMuPDF
except ImportError:  # pragma: no cover - availability depends on host env
    fitz = None

try:  # Optional OCR stack
    import pytesseract  # type: ignore
except ImportError:  # pragma: no cover - availability depends on host env
    pytesseract = None

try:
    from PIL import Image  # type: ignore
except ImportError:  # pragma: no cover - availability depends on host env
    Image = None

router = APIRouter()

MAX_BYTES = 10 * 1024 * 1024  # 10MB
STORAGE_DIR = Path(__file__).resolve().parent / "_reports"
STORAGE_DIR.mkdir(parents=True, exist_ok=True)

REPORTS: Dict[str, Dict[str, Any]] = {}


class ReportSummary(BaseModel):
    id: str
    filename: str
    pages: int
    text_len: int
    user_id: str
    bureau: str
    report_date: Optional[str] = None
    created_at: str
    has_parsed_data: bool


class ReportDetail(ReportSummary):
    ai_service: Optional[str] = None
    parsed_json: Optional[Dict[str, Any]] = None
    text_content: str


def _now_iso() -> str:
    return datetime.utcnow().replace(microsecond=0).isoformat() + "Z"


def _report_path(report_id: str) -> Path:
    return STORAGE_DIR / f"report_{report_id}.txt"


def _legacy_paths(report_id: str) -> List[Path]:
    base = Path(__file__).resolve().parent.parent
    cwd = Path.cwd()
    return [base / f"report_{report_id}.txt", cwd / f"report_{report_id}.txt"]


def _get_report(report_id: str) -> Dict[str, Any]:
    report = REPORTS.get(report_id)
    if not report:
        raise HTTPException(404, "Report not found")
    return report


def _load_text(report: Dict[str, Any]) -> str:
    candidates: List[Path] = []
    if report.get("text_path"):
        candidates.append(Path(report["text_path"]))
    candidates.append(_report_path(report["id"]))
    candidates.extend(_legacy_paths(report["id"]))

    for path in candidates:
        if path and path.exists():
            try:
                return path.read_text(encoding="utf-8")
            except Exception:
                continue
    return ""


def _save_text(report_id: str, content: str) -> Path:
    path = _report_path(report_id)
    try:
        path.write_text(content, encoding="utf-8")
    except Exception as exc:
        print(f"Failed to save report text: {exc}")
    return path


def _to_summary(record: Dict[str, Any]) -> ReportSummary:
    return ReportSummary(
        id=record["id"],
        filename=record.get("filename", ""),
        pages=record.get("pages", 0),
        text_len=record.get("text_len", 0),
        user_id=record.get("user_id", ""),
        bureau=record.get("bureau", "Unknown"),
        report_date=record.get("report_date"),
        created_at=record.get("created_at", _now_iso()),
        has_parsed_data=bool(record.get("parsed_json")),
    )


def _log_event(event: str, request: Request, **extra: Any) -> None:
    payload = {
        "event": event,
        "req_id": request.headers.get("X-Request-ID"),
        **extra,
    }
    print(json.dumps(payload))


@router.get("")
def list_reports() -> List[ReportSummary]:
    records = sorted(REPORTS.values(), key=lambda r: r.get("created_at", ""), reverse=True)
    return [_to_summary(rec) for rec in records]


@router.post("/upload", response_model=ReportSummary)
async def upload_report(
    request: Request,
    user_id: str = Query(..., description="Client identifier associated with the upload"),
    bureau: str = Query(..., description="Credit bureau name"),
    report_date: Optional[str] = Query(None, description="Optional report date in ISO format"),
    e_oscar_bypass: Optional[bool] = Query(False, description="Flag indicating if E-Oscar bypass strategies are enabled"),
    file: UploadFile = File(...),
):
    if fitz is None:
        raise HTTPException(
            503,
            "PDF processing is unavailable because PyMuPDF is not installed. Install it with 'pip install pymupdf' to enable uploads.",
        )

    bureau = bureau.strip()
    if not bureau:
        raise HTTPException(400, "Bureau is required")
    user_id = user_id.strip()
    if not user_id:
        raise HTTPException(400, "Client identifier is required")

    if file.content_type not in ("application/pdf", "application/octet-stream", None):
        raise HTTPException(415, "Unsupported file type: must be application/pdf")

    content = await file.read()
    if not content:
        raise HTTPException(400, "Empty file")
    if len(content) > MAX_BYTES:
        raise HTTPException(413, "File too large (limit 10MB)")

    t0 = time.time()
    try:
        doc = fitz.open(stream=content, filetype="pdf")
    except Exception as exc:
        raise HTTPException(400, f"Invalid PDF file: {exc}")

    ocr_ms = 0
    all_text = ""
    ocr_available = pytesseract is not None and Image is not None
    page_count = doc.page_count

    try:
        for index in range(page_count):
            page = doc.load_page(index)
            text = page.get_text("text") or ""
            if text.strip():
                all_text += text + "\n"
            elif ocr_available:
                try:
                    t_ocr = time.time()
                    pix = page.get_pixmap(dpi=200)
                    with Image.open(io.BytesIO(pix.tobytes("png"))) as img:  # type: ignore[arg-type]
                        ocr_text = pytesseract.image_to_string(img) or ""
                    ocr_ms += int((time.time() - t_ocr) * 1000)
                    all_text += ocr_text + "\n"
                except Exception as exc:  # pragma: no cover - diagnostics only
                    print(f"OCR failed for page {index}: {exc}")
                    all_text += f"[OCR failed for page {index}]\n"
            else:
                all_text += f"[OCR unavailable for page {index}: install Pillow and pytesseract]\n"
    finally:
        doc.close()

    report_id = str(uuid.uuid4())
    text_path = _save_text(report_id, all_text)

    record = {
        "id": report_id,
        "filename": file.filename or f"report-{report_id}.pdf",
        "pages": page_count,
        "text_len": len(all_text),
        "user_id": user_id,
        "bureau": bureau,
        "report_date": report_date,
        "created_at": _now_iso(),
        "parsed_json": None,
        "ai_service": None,
        "text_path": str(text_path),
        "options": {"e_oscar_bypass": bool(e_oscar_bypass)},
    }
    REPORTS[report_id] = record

    elapsed_ms = int((time.time() - t0) * 1000)
    _log_event(
        "report_uploaded",
        request,
        report_id=report_id,
        filename=file.filename,
        pages=page_count,
        text_len=len(all_text),
        ocr_ms=ocr_ms,
        total_ms=elapsed_ms,
        user_id=user_id,
        bureau=bureau,
    )
    return _to_summary(record)


@router.get("/{report_id}", response_model=ReportDetail)
def get_report(report_id: str) -> ReportDetail:
    report = _get_report(report_id)
    text_content = _load_text(report)
    return ReportDetail(
        **_to_summary(report).model_dump(),
        ai_service=report.get("ai_service"),
        parsed_json=report.get("parsed_json"),
        text_content=text_content,
    )


@router.delete("/{report_id}")
def delete_report(report_id: str):
    report = REPORTS.pop(report_id, None)
    if report:
        for path in {Path(report.get("text_path", "")), _report_path(report_id), *_legacy_paths(report_id)}:
            if path and path.exists():
                try:
                    path.unlink()
                except FileNotFoundError:  # pragma: no cover - race condition only
                    continue
    return {"deleted": True}


async def _perform_analysis(report_id: str, request: Request) -> Dict[str, Any]:
    report = _get_report(report_id)
    text_content = _load_text(report)
    if not text_content.strip():
        payload = {
            "summary": {
                "parsing_failed": True,
                "error": "No text content available for analysis",
                "parsed": False,
            },
            "parsed_json": None,
            "chars": 0,
            "ai_service": "none",
        }
        _log_event("report_analysis_skipped", request, report_id=report_id, reason="empty_text")
        return payload

    from apps.api.services.credit_analyzer import CreditReportAnalyzer

    analyzer = CreditReportAnalyzer()
    t0 = time.time()
    analysis = analyzer.analyze_credit_report(report.get("bureau"), report.get("user_id"), text_content)
    elapsed_ms = int((time.time() - t0) * 1000)

    report["parsed_json"] = analysis
    report["ai_service"] = analysis.get("ai_service", "unknown") if isinstance(analysis, dict) else "unknown"

    _log_event(
        "report_analyzed",
        request,
        report_id=report_id,
        chars=len(text_content),
        analysis_ms=elapsed_ms,
        ai_service=report.get("ai_service"),
    )

    return {
        "summary": analysis,
        "parsed_json": analysis,
        "chars": len(text_content),
        "ai_service": report.get("ai_service", "unknown"),
    }


@router.post("/{report_id}/parse")
async def parse_report(report_id: str, request: Request):
    return await _perform_analysis(report_id, request)


@router.post("/analyze")
async def analyze_report(request: Request):
    payload: Dict[str, Any] = {}
    if request.headers.get("content-type", "").startswith("application/json"):
        try:
            payload = await request.json()
        except Exception:
            payload = {}
    report_id = payload.get("report_id") or request.query_params.get("report_id")
    if not report_id:
        raise HTTPException(400, "report_id is required")
    return await _perform_analysis(report_id, request)


@router.get("/{report_id}/download")
def download_report(report_id: str):
    report = _get_report(report_id)
    text_content = _load_text(report)
    lines = [
        f"Report ID: {report['id']}",
        f"Filename: {report.get('filename', 'N/A')}",
        f"Client ID: {report.get('user_id', 'N/A')}",
        f"Bureau: {report.get('bureau', 'Unknown')}",
        f"Uploaded: {report.get('created_at', 'Unknown')}",
        f"Pages: {report.get('pages', 0)}",
        f"Extracted Characters: {report.get('text_len', 0)}",
        "",
        "================ ORIGINAL TEXT ================",
        text_content or "(No extracted text available)",
        "",
    ]

    analysis = report.get("parsed_json")
    if analysis:
        lines.extend([
            "================ AI ANALYSIS ================",
            json.dumps(analysis, indent=2, ensure_ascii=False),
        ])
    else:
        lines.append("AI analysis has not been generated for this report yet.")

    payload = "\n".join(lines)
    filename = f"{report.get('bureau', 'report').lower().replace(' ', '-')}-{report_id}.txt"
    headers = {"Content-Disposition": f"attachment; filename=\"{filename}\""}
    return PlainTextResponse(payload, headers=headers)
