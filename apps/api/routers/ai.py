"""
AI Health and Status Endpoints
"""

from fastapi import APIRouter, HTTPException
from typing import Dict, Any
import logging

from apps.api.ollama_client import ollama_client

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/health")
def ai_health() -> Dict[str, Any]:
    """
    Check AI service health and return status information
    
    Returns:
        Health status including Ollama availability, model info, and latency
    """
    try:
        health_info = ollama_client.health_check()
        model_info = ollama_client.get_model_info()
        
        return {
            "ai_service": "ollama",
            "health": health_info,
            "model_info": model_info,
            "recommendations": {
                "model": "llama3.2:3b",
                "quant": "q4_K_M",
                "ram_required": "6-8GB",
                "alternative": "llama3.2:3b-instruct (for low RAM)"
            }
        }
        
    except Exception as e:
        logger.error(f"AI health check failed: {e}")
        return {
            "ai_service": "ollama",
            "health": {
                "reachable": False,
                "error": f"Health check failed: {str(e)}"
            },
            "model_info": {
                "configured_model": ollama_client.model,
                "error": "Unable to get model information"
            }
        }

@router.get("/models")
def list_ai_models() -> Dict[str, Any]:
    """
    List available AI models and their status
    
    Returns:
        Available models and recommendations
    """
    try:
        model_info = ollama_client.get_model_info()
        return {
            "ai_service": "ollama",
            "models": model_info,
            "status": "success"
        }
        
    except Exception as e:
        logger.error(f"Failed to list AI models: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to list models: {str(e)}")

@router.post("/test")
def test_ai_generation(prompt: str = "Hello, respond with just: OK") -> Dict[str, Any]:
    """
    Test AI generation with a simple prompt
    
    Args:
        prompt: Test prompt to send to AI
        
    Returns:
        Generation result and timing information
    """
    try:
        import time
        start_time = time.time()
        
        result = ollama_client.generate(prompt, max_tokens=50, temperature=0.1)
        
        end_time = time.time()
        duration = end_time - start_time
        
        if result:
            return {
                "ai_service": "ollama",
                "result": result,
                "duration_ms": round(duration * 1000, 2),
                "status": "success"
            }
        else:
            return {
                "ai_service": "ollama",
                "result": None,
                "duration_ms": round(duration * 1000, 2),
                "error": "Generation failed",
                "status": "failed"
            }
            
    except Exception as e:
        logger.error(f"AI test generation failed: {e}")
        raise HTTPException(status_code=500, detail=f"Test failed: {str(e)}")