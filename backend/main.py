"""
Socratic Lens - FastAPI Backend
Vision AI powered by Llama 3.2 Vision via Groq
"""

import os
import base64
from io import BytesIO
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from dotenv import load_dotenv
from groq import Groq
from PIL import Image

# Load environment variables
load_dotenv()

# Initialize Groq client
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# Initialize FastAPI app
app = FastAPI(
    title="Socratic Lens API",
    description="AI-powered homework analysis using Llama 3.2 Vision",
    version="1.0.0"
)

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Response Models
class AnalysisResponse(BaseModel):
    extracted_text: str
    problem_type: str
    subject: str
    difficulty: Optional[str] = None
    key_concepts: List[str] = []


class HintResponse(BaseModel):
    hint: str
    hint_type: str  # 'question', 'nudge', 'concept'
    follow_up: Optional[str] = None


def encode_image_to_base64(image_bytes: bytes) -> str:
    """Convert image bytes to base64 string."""
    return base64.b64encode(image_bytes).decode("utf-8")


def resize_image_if_needed(image_bytes: bytes, max_size: int = 1024) -> bytes:
    """Resize image if too large to reduce API costs."""
    img = Image.open(BytesIO(image_bytes))
    
    # Convert to RGB if necessary
    if img.mode in ('RGBA', 'P'):
        img = img.convert('RGB')
    
    # Resize if larger than max_size
    if max(img.size) > max_size:
        ratio = max_size / max(img.size)
        new_size = (int(img.size[0] * ratio), int(img.size[1] * ratio))
        img = img.resize(new_size, Image.Resampling.LANCZOS)
    
    # Save to bytes
    buffer = BytesIO()
    img.save(buffer, format="JPEG", quality=85)
    return buffer.getvalue()


@app.get("/")
async def root():
    """Health check endpoint."""
    return {"status": "online", "service": "Socratic Lens API"}


@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_image(file: UploadFile = File(...)):
    """
    Analyze a homework image using Llama 3.2 Vision.
    Extracts text, identifies problem type, and subject.
    """
    try:
        # Read and process image
        image_bytes = await file.read()
        image_bytes = resize_image_if_needed(image_bytes)
        base64_image = encode_image_to_base64(image_bytes)
        
        # Call Llama 3.2 Vision via Groq
        response = client.chat.completions.create(
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": """Analyze this homework problem image. Extract and provide:
1. The exact text/equation shown in the image
2. The type of problem (e.g., 'quadratic_equation', 'physics_kinematics', 'chemical_balance', 'calculus_derivative')
3. The subject (e.g., 'Mathematics', 'Physics', 'Chemistry', 'Biology')
4. Key concepts involved

Respond in this exact JSON format:
{
    "extracted_text": "the exact problem text/equation",
    "problem_type": "type_of_problem",
    "subject": "Subject Name",
    "difficulty": "easy/medium/hard",
    "key_concepts": ["concept1", "concept2"]
}

Only respond with the JSON, no other text."""
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{base64_image}"
                            }
                        }
                    ]
                }
            ],
            max_tokens=500,
            temperature=0.1
        )
        
        # Parse response
        import json
        result_text = response.choices[0].message.content.strip()
        
        # Try to extract JSON from response
        try:
            # Handle potential markdown code blocks
            if "```json" in result_text:
                result_text = result_text.split("```json")[1].split("```")[0]
            elif "```" in result_text:
                result_text = result_text.split("```")[1].split("```")[0]
            
            result = json.loads(result_text)
        except json.JSONDecodeError:
            # Fallback if JSON parsing fails
            result = {
                "extracted_text": result_text,
                "problem_type": "unknown",
                "subject": "Unknown",
                "difficulty": None,
                "key_concepts": []
            }
        
        return AnalysisResponse(**result)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@app.post("/hint", response_model=HintResponse)
async def get_socratic_hint(
    problem_text: str,
    problem_type: str,
    subject: str,
    user_question: Optional[str] = None,
    previous_hints: Optional[List[str]] = None
):
    """
    Generate a Socratic hint for the given problem.
    Never gives the answer directly - only guiding questions.
    """
    try:
        # Build context from previous hints
        hint_history = ""
        if previous_hints:
            hint_history = "\n".join([f"- Previous hint: {h}" for h in previous_hints[-3:]])
        
        user_context = f"\nStudent's question: {user_question}" if user_question else ""
        
        prompt = f"""You are a Socratic tutor. Your goal is to help students THINK, never give answers directly.

Problem: {problem_text}
Subject: {subject}
Problem Type: {problem_type}
{hint_history}
{user_context}

Generate ONE Socratic hint that:
1. Asks a guiding question OR points to a key concept
2. Helps the student discover the next step themselves
3. NEVER reveals the answer or solution steps directly
4. Is encouraging and supportive

Respond in this exact JSON format:
{{
    "hint": "Your Socratic question or nudge here",
    "hint_type": "question OR nudge OR concept",
    "follow_up": "Optional follow-up thought"
}}

Only respond with the JSON."""

        response = client.chat.completions.create(
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=200,
            temperature=0.7
        )
        
        import json
        result_text = response.choices[0].message.content.strip()
        
        try:
            if "```json" in result_text:
                result_text = result_text.split("```json")[1].split("```")[0]
            elif "```" in result_text:
                result_text = result_text.split("```")[1].split("```")[0]
            
            result = json.loads(result_text)
        except json.JSONDecodeError:
            result = {
                "hint": result_text,
                "hint_type": "question",
                "follow_up": None
            }
        
        return HintResponse(**result)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Hint generation failed: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
