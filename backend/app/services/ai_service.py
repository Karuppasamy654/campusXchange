import json
import re
import logging
from typing import Dict, Any, Optional
from google import genai
from app.core.config import settings

logger = logging.getLogger(__name__)

class AIService:
    def __init__(self):
        self.client = None
        if settings.GEMINI_API_KEY and settings.GEMINI_API_KEY != "your-gemini-api-key-here":
            try:
                self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
            except Exception as e:
                logger.warning(f"Could not initialize Gemini Client: {e}")

    async def parse_natural_language_intent(self, user_query: str) -> Dict[str, Any]:
        """
        Uses Gemini API (or fallback rule parser) to translate raw campus query into structured DB intent JSON.
        """
        if self.client:
            try:
                prompt = f"""
                You are a database query intent parser for a university campus resource platform.
                Parse the user query into a JSON object with keys:
                - category (string, e.g. "calculator", "textbook", "lab_kit", "component", "tools", "notes")
                - subject (string or null)
                - keywords (list of strings)
                - location_required (boolean)
                - max_distance_meters (integer or null)

                User query: "{user_query}"
                Return ONLY valid JSON.
                """
                response = self.client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=prompt
                )
                text = response.text.strip()
                # Clean code blocks if present
                if "```json" in text:
                    text = text.split("```json")[1].split("```")[0].strip()
                elif "```" in text:
                    text = text.split("```")[1].split("```")[0].strip()
                
                return json.loads(text)
            except Exception as e:
                logger.warning(f"Gemini API parse failed or unconfigured, using fallback NLU parser: {e}")

        # Rule-based fallback NLU parser
        q_lower = user_query.lower()
        category = "all"
        for cat in ["calculator", "textbook", "lab_kit", "component", "tools", "notes"]:
            if cat in q_lower or (cat == "notes" and ("paper" in q_lower or "pyq" in q_lower or "manual" in q_lower)):
                category = cat
                break
        if "calc" in q_lower and category == "all":
            category = "calculator"

        subject = None
        for s in ["dbms", "math", "mathematics", "ds", "algorithms", "physics", "electronics", "circuits"]:
            if s in q_lower:
                subject = s.upper()
                break

        location_required = "near" in q_lower or "close" in q_lower or "campus" in q_lower or "library" in q_lower

        return {
            "category": category,
            "subject": subject,
            "keywords": [w for w in re.findall(r'\w+', q_lower) if len(w) > 2],
            "location_required": location_required,
            "max_distance_meters": 1000 if location_required else None,
            "parsedBy": "Rule-Based Campus NLU Engine"
        }

ai_service = AIService()
