"""
Centralized Ollama client for AI analysis
Handles model selection, timeouts, retries, and error handling
"""

import os
import time
import requests
from typing import Optional, Dict, Any
import logging

logger = logging.getLogger(__name__)

class OllamaClient:
    def __init__(self):
        self.host = os.getenv("OLLAMA_HOST", "http://127.0.0.1:11434")
        self.model = os.getenv("OLLAMA_MODEL", "llama3.2:3b")
        self.timeout = int(os.getenv("OLLAMA_TIMEOUT_SECONDS", "20"))
        self.connect_timeout = 2
        self.max_retries = 2
        
        logger.info(f"OllamaClient initialized: {self.host}, model: {self.model}, timeout: {self.timeout}s")
    
    def is_available(self) -> bool:
        """Check if Ollama is running and accessible"""
        try:
            response = requests.get(
                f"{self.host}/api/tags", 
                timeout=self.connect_timeout
            )
            return response.status_code == 200
        except Exception as e:
            logger.warning(f"Ollama not available: {e}")
            return False
    
    def get_available_models(self) -> list[str]:
        """Get list of available Ollama models"""
        try:
            response = requests.get(
                f"{self.host}/api/tags", 
                timeout=self.connect_timeout
            )
            if response.status_code == 200:
                data = response.json()
                return [model["name"] for model in data.get("models", [])]
            return []
        except Exception as e:
            logger.error(f"Failed to get Ollama models: {e}")
            return []
    
    def generate(self, prompt: str, max_tokens: int = 512, temperature: float = 0.1) -> Optional[str]:
        """
        Generate text using Ollama with retries and proper error handling
        
        Args:
            prompt: The input prompt
            max_tokens: Maximum tokens to generate
            temperature: Sampling temperature (0.0 to 1.0)
            
        Returns:
            Generated text or None if failed
        """
        if not self.is_available():
            logger.error("Ollama not available")
            return None
        
        payload = {
            "model": self.model,
            "prompt": prompt,
            "stream": False,
            "options": {
                "temperature": temperature,
                "top_p": 0.9,
                "num_predict": max_tokens
            }
        }
        
        for attempt in range(self.max_retries + 1):
            try:
                start_time = time.time()
                
                response = requests.post(
                    f"{self.host}/api/generate",
                    json=payload,
                    timeout=self.timeout
                )
                
                end_time = time.time()
                duration = end_time - start_time
                
                if response.status_code == 200:
                    result = response.json()
                    generated_text = result.get("response", "").strip()
                    
                    if generated_text:
                        tokens_per_sec = len(generated_text.split()) / duration if duration > 0 else 0
                        logger.info(f"Ollama generation successful: {len(generated_text)} chars, {duration:.2f}s, ~{tokens_per_sec:.1f} tokens/sec")
                        return generated_text
                    else:
                        logger.warning("Ollama returned empty response")
                        return None
                else:
                    logger.error(f"Ollama API error: {response.status_code} - {response.text}")
                    
            except requests.exceptions.Timeout:
                logger.error(f"Ollama timeout (attempt {attempt + 1}/{self.max_retries + 1})")
                if attempt < self.max_retries:
                    time.sleep(1)  # Brief delay before retry
                    continue
                else:
                    logger.error("Ollama timeout after all retries")
                    return None
                    
            except requests.exceptions.ConnectionError as e:
                logger.error(f"Ollama connection error (attempt {attempt + 1}/{self.max_retries + 1}): {e}")
                if attempt < self.max_retries:
                    time.sleep(1)
                    continue
                else:
                    logger.error("Ollama connection failed after all retries")
                    return None
                    
            except Exception as e:
                logger.error(f"Unexpected Ollama error: {e}")
                return None
        
        return None
    
    def health_check(self) -> Dict[str, Any]:
        """
        Perform health check and return status information
        
        Returns:
            Dictionary with health status, model info, and latency
        """
        if not self.is_available():
            return {
                "reachable": False,
                "model": self.model,
                "error": "Ollama not accessible"
            }
        
        try:
            # Test with a simple prompt
            start_time = time.time()
            result = self.generate("Say OK", max_tokens=10, temperature=0.1)
            end_time = time.time()
            
            if result:
                latency = end_time - start_time
                return {
                    "reachable": True,
                    "model": self.model,
                    "latency_ms": round(latency * 1000, 2),
                    "status": "healthy"
                }
            else:
                return {
                    "reachable": True,
                    "model": self.model,
                    "error": "Generation failed"
                }
                
        except Exception as e:
            return {
                "reachable": True,
                "model": self.model,
                "error": f"Health check failed: {str(e)}"
            }
    
    def get_model_info(self) -> Dict[str, Any]:
        """Get information about the current model"""
        models = self.get_available_models()
        return {
            "configured_model": self.model,
            "available_models": models,
            "model_available": self.model in models,
            "recommended_model": "llama3.2:3b",
            "recommended_quant": "q4_K_M"
        }

# Global instance
ollama_client = OllamaClient()
