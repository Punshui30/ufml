import json, logging, time, uuid
from typing import Callable
from fastapi import Request, Response

logger = logging.getLogger("uvicorn.access")
handler = logging.StreamHandler()
formatter = logging.Formatter('%(message)s')
handler.setFormatter(formatter)
logger.handlers = [handler]
logger.setLevel(logging.INFO)

async def with_request_log(request: Request, call_next: Callable):
    start = time.time()
    req_id = request.headers.get("X-Request-ID") or str(uuid.uuid4())
    try:
        response: Response = await call_next(request)
        status = response.status_code
    except Exception as e:
        status = 500
        raise e
    finally:
        elapsed_ms = int((time.time() - start) * 1000)
        entry = {
            "req_id": req_id,
            "method": request.method,
            "path": request.url.path,
            "status": status,
            "elapsed_ms": elapsed_ms,
            "origin": request.headers.get("origin"),
        }
        logger.info(json.dumps(entry))
    # echo request id so clients can surface it
    response.headers["X-Request-ID"] = req_id
    return response
