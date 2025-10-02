import io, uuid, time, json
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, UploadFile, File, HTTPException, Request
from pydantic import BaseModel
import fitz  # PyMuPDF
import pytesseract
from PIL import Image

router = APIRouter()

REPORTS = []  # in-memory for dev
MAX_BYTES = 10 * 1024 * 1024  # 10MB

class ReportOut(BaseModel):
    id: str
    filename: str
    pages: int
    text_len: int
    created_at: Optional[str] = None
    has_parsed_data: bool = False
    user_id: Optional[str] = None
    bureau: Optional[str] = None
    report_date: Optional[str] = None

def _with_defaults(report: dict) -> ReportOut:
    """Ensure reports expose metadata the frontend expects."""
    enriched = {
        **report,
        "created_at": report.get("created_at") or datetime.utcnow().isoformat() + "Z",
        "has_parsed_data": report.get("has_parsed_data", bool(report.get("text_len"))),
        "user_id": report.get("user_id") or "client_1759251660898",
        "bureau": report.get("bureau") or _infer_bureau(report.get("filename")),
        "report_date": report.get("report_date") or datetime.utcnow().isoformat() + "Z",
    }
    return ReportOut(**enriched)


def _infer_bureau(filename: Optional[str]) -> Optional[str]:
    if not filename:
        return None
    lowered = filename.lower()
    if "equifax" in lowered:
        return "Equifax"
    if "experian" in lowered:
        return "Experian"
    if "transunion" in lowered:
        return "TransUnion"
    return "Unknown"


@router.get("")
def list_reports() -> dict:
    return {"reports": [_with_defaults(r) for r in REPORTS]}

@router.post("/upload", response_model=ReportOut)
async def upload_report(request: Request, file: UploadFile = File(...)):
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
    except Exception as e:
        raise HTTPException(400, f"Invalid PDF file: {str(e)}")
    
    ocr_ms = 0
    all_text = ""
    for i in range(doc.page_count):
        page = doc.load_page(i)
        text = page.get_text("text") or ""
        if text.strip():
            all_text += text + "\n"
        else:
            # OCR fallback
            try:
                t_ocr = time.time()
                pix = page.get_pixmap(dpi=200)
                img = Image.open(io.BytesIO(pix.tobytes("png")))
                ocr_text = pytesseract.image_to_string(img) or ""
                ocr_ms += int((time.time() - t_ocr) * 1000)
                all_text += ocr_text + "\n"
            except Exception as e:
                print(f"OCR failed for page {i}: {e}")
                all_text += f"[OCR failed for page {i}]\n"

    doc.close()

    rid = str(uuid.uuid4())
    try:
        with open(f"./report_{rid}.txt", "w", encoding="utf-8") as f:
            f.write(all_text)
    except Exception as e:
        print(f"Failed to save report text: {e}")

    now_iso = datetime.utcnow().isoformat() + "Z"
    rec = {
        "id": rid,
        "filename": file.filename,
        "pages": doc.page_count,
        "text_len": len(all_text),
        "created_at": now_iso,
        "report_date": now_iso,
        "has_parsed_data": bool(all_text.strip()),
        "user_id": request.headers.get("X-User-ID") or "client_1759251660898",
        "bureau": _infer_bureau(file.filename),
    }
    REPORTS.append(rec)

    elapsed_ms = int((time.time() - t0) * 1000)
    # basic structured log (backend already adds req-log; this is record-level)
    print(json.dumps({
        "event": "report_uploaded",
        "req_id": request.headers.get("X-Request-ID"),
        "filename": file.filename,
        "pages": doc.page_count,
        "text_len": len(all_text),
        "ocr_ms": ocr_ms,
        "total_ms": elapsed_ms,
    }))
    return ReportOut(**rec)

@router.get("/{report_id}")
def get_report(report_id: str):
    report = next((r for r in REPORTS if r["id"] == report_id), None)
    if not report:
        raise HTTPException(404, "Report not found")
    
    try:
        with open(f"./report_{report_id}.txt", "r", encoding="utf-8") as f:
            text_content = f.read()
    except FileNotFoundError:
        text_content = ""
    
    return {
        **report,
        "text_content": text_content,
        "parsed_json": None,  # Will be populated by AI analysis
        "ai_service": "none"
    }

@router.delete("/{report_id}")
def delete_report(report_id: str):
    global REPORTS
    REPORTS = [r for r in REPORTS if r["id"] != report_id]
    try:
        import os; os.remove(f"./report_{report_id}.txt")
    except FileNotFoundError:
        pass
    return {"deleted": True}

@router.post("/analyze")
async def analyze_report(request: Request, report_id: str):
    """Analyze a report using AI"""
    report = next((r for r in REPORTS if r["id"] == report_id), None)
    if not report:
        raise HTTPException(404, "Report not found")
    
    try:
        with open(f"./report_{report_id}.txt", "r", encoding="utf-8") as f:
            text_content = f.read()
    except FileNotFoundError:
        raise HTTPException(404, "Report text not found")
    
    if not text_content.strip():
        return {
            "summary": "No text content available for analysis",
            "parsed_json": {},
            "chars": 0,
            "ai_service": "none"
        }
    
    # Use the centralized AI analysis
    from apps.api.services.credit_analyzer import CreditReportAnalyzer
    analyzer = CreditReportAnalyzer()
    
    t0 = time.time()
    analysis = analyzer.analyze_credit_report("Experian", None, text_content)
    elapsed_ms = int((time.time() - t0) * 1000)
    
    print(json.dumps({
        "event": "report_analyzed",
        "req_id": request.headers.get("X-Request-ID"),
        "report_id": report_id,
        "chars": len(text_content),
        "analysis_ms": elapsed_ms,
        "ai_service": analysis.get("ai_service", "unknown")
    }))
    
    return {
        "summary": analysis,
        "parsed_json": analysis,
        "chars": len(text_content),
        "ai_service": analysis.get("ai_service", "unknown")
    }