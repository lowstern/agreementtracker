"""
AI Extraction Service

Uses Claude/OpenAI to extract clause information from legal document text.
"""

import os
import json
import re
from typing import Optional
from dotenv import load_dotenv

# Ensure environment variables are loaded
load_dotenv()

# Try to import anthropic, fall back to openai
try:
    import anthropic
    ANTHROPIC_AVAILABLE = True
except ImportError:
    ANTHROPIC_AVAILABLE = False

try:
    import openai
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False


EXTRACTION_PROMPT = """You are a legal document analyst specializing in private equity fund agreements. 
Analyze the following document text and extract all relevant clauses.

For each clause found, extract:
1. clause_type: One of these exact types:
   - "Management Fee"
   - "Carry Terms"
   - "MFN (Most Favored Nation)"
   - "Fee Waiver/Discount"
   - "Co-investment Rights"
   - "Fee Step-Down"
   - "Preferred Return"
   - "Other"

2. rate: Numeric percentage value (e.g., 2.0 for 2%) - only for fees/returns
3. discount: Numeric percentage value for discounts/reductions
4. threshold: Text describing conditions (e.g., "Year 4", "Commitment >= $100M")
5. threshold_amount: Numeric dollar amount if mentioned (without $ or commas)
6. effective_date: Date in YYYY-MM-DD format if mentioned
7. section_ref: Section reference (e.g., "3.2", "6.1(a)")
8. page_number: Page number if mentioned
9. clause_text: The exact quote from the document (keep it concise, max 500 chars)
10. confidence: Your confidence level from 0.0 to 1.0
11. notes: Any relevant notes about the extraction

Return a JSON object with this structure:
{
  "document_info": {
    "detected_type": "Side Letter" | "Subscription Agreement" | "PPM" | "Amendment" | "Fee Schedule" | "Unknown",
    "detected_investor": "Investor name if found",
    "detected_fund": "Fund name if found",
    "effective_date": "YYYY-MM-DD if found"
  },
  "clauses": [
    {
      "clause_type": "...",
      "rate": null or number,
      "discount": null or number,
      "threshold": null or "...",
      "threshold_amount": null or number,
      "effective_date": null or "YYYY-MM-DD",
      "section_ref": null or "...",
      "page_number": null or number,
      "clause_text": "...",
      "confidence": 0.0-1.0,
      "notes": "..."
    }
  ],
  "extraction_notes": "Any overall notes about the extraction"
}

IMPORTANT:
- Only extract clauses that are explicitly stated in the document
- Use exact quotes for clause_text
- Be conservative with confidence scores
- If a field is not found, use null
- Return valid JSON only, no markdown formatting

Document text to analyze:
"""


def extract_clauses_with_anthropic(text: str, api_key: str) -> dict:
    """Extract clauses using Anthropic Claude API."""
    client = anthropic.Anthropic(api_key=api_key)
    
    message = client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=4096,
        messages=[
            {
                "role": "user",
                "content": EXTRACTION_PROMPT + text
            }
        ]
    )
    
    # Parse the response
    response_text = message.content[0].text
    
    # Try to extract JSON from the response
    try:
        # Handle potential markdown code blocks
        if "```json" in response_text:
            json_match = re.search(r'```json\s*(.*?)\s*```', response_text, re.DOTALL)
            if json_match:
                response_text = json_match.group(1)
        elif "```" in response_text:
            json_match = re.search(r'```\s*(.*?)\s*```', response_text, re.DOTALL)
            if json_match:
                response_text = json_match.group(1)
        
        return json.loads(response_text)
    except json.JSONDecodeError as e:
        return {
            "error": f"Failed to parse AI response: {str(e)}",
            "raw_response": response_text[:1000]
        }


def extract_clauses_with_openai(text: str, api_key: str) -> dict:
    """Extract clauses using OpenAI API."""
    client = openai.OpenAI(api_key=api_key)
    
    response = client.chat.completions.create(
        model="gpt-4-turbo-preview",
        messages=[
            {
                "role": "system",
                "content": "You are a legal document analyst. Return only valid JSON."
            },
            {
                "role": "user",
                "content": EXTRACTION_PROMPT + text
            }
        ],
        response_format={"type": "json_object"},
        max_tokens=4096
    )
    
    response_text = response.choices[0].message.content
    
    try:
        return json.loads(response_text)
    except json.JSONDecodeError as e:
        return {
            "error": f"Failed to parse AI response: {str(e)}",
            "raw_response": response_text[:1000]
        }


def extract_clauses(text: str, provider: str = "auto") -> dict:
    """
    Extract clauses from document text using AI.
    
    Args:
        text: The document text to analyze
        provider: "anthropic", "openai", or "auto" (tries anthropic first)
    
    Returns:
        Extracted clause information as a dict
    """
    # Check for API keys
    anthropic_key = os.environ.get("ANTHROPIC_API_KEY")
    openai_key = os.environ.get("OPENAI_API_KEY")
    
    if provider == "auto":
        if anthropic_key and ANTHROPIC_AVAILABLE:
            provider = "anthropic"
        elif openai_key and OPENAI_AVAILABLE:
            provider = "openai"
        else:
            return {
                "error": "No AI provider available. Set ANTHROPIC_API_KEY or OPENAI_API_KEY environment variable.",
                "document_info": {},
                "clauses": []
            }
    
    if provider == "anthropic":
        if not anthropic_key:
            return {"error": "ANTHROPIC_API_KEY not set", "document_info": {}, "clauses": []}
        if not ANTHROPIC_AVAILABLE:
            return {"error": "anthropic package not installed", "document_info": {}, "clauses": []}
        return extract_clauses_with_anthropic(text, anthropic_key)
    
    elif provider == "openai":
        if not openai_key:
            return {"error": "OPENAI_API_KEY not set", "document_info": {}, "clauses": []}
        if not OPENAI_AVAILABLE:
            return {"error": "openai package not installed", "document_info": {}, "clauses": []}
        return extract_clauses_with_openai(text, openai_key)
    
    else:
        return {"error": f"Unknown provider: {provider}", "document_info": {}, "clauses": []}


def mock_extract_clauses(text: str) -> dict:
    """
    Mock extraction for testing without AI API.
    Performs simple pattern matching to extract basic information.
    """
    clauses = []
    
    # Simple pattern matching for common clauses
    patterns = [
        {
            "type": "Management Fee",
            "pattern": r"[Mm]anagement [Ff]ee[s]?\s*(?:shall be|of|:)?\s*(\d+\.?\d*)\s*%",
            "field": "rate"
        },
        {
            "type": "Preferred Return",
            "pattern": r"[Pp]referred [Rr]eturn[s]?\s*(?:of|:)?\s*(\d+\.?\d*)\s*%",
            "field": "rate"
        },
        {
            "type": "Carry Terms",
            "pattern": r"[Cc]arried [Ii]nterest\s*(?:of|:)?\s*(\d+\.?\d*)\s*%",
            "field": "rate"
        },
        {
            "type": "Fee Step-Down",
            "pattern": r"(?:reduced|step.?down)\s*(?:by|of)?\s*(\d+\.?\d*)\s*%",
            "field": "discount"
        },
    ]
    
    for p in patterns:
        matches = re.finditer(p["pattern"], text, re.IGNORECASE)
        for match in matches:
            value = float(match.group(1))
            # Find surrounding context for clause_text
            start = max(0, match.start() - 50)
            end = min(len(text), match.end() + 100)
            context = text[start:end].strip()
            
            clause = {
                "clause_type": p["type"],
                "rate": value if p["field"] == "rate" else None,
                "discount": value if p["field"] == "discount" else None,
                "threshold": None,
                "threshold_amount": None,
                "effective_date": None,
                "section_ref": None,
                "page_number": None,
                "clause_text": context,
                "confidence": 0.6,  # Lower confidence for pattern matching
                "notes": "Extracted via pattern matching (mock mode)"
            }
            clauses.append(clause)
    
    # Check for MFN
    if re.search(r"[Mm]ost [Ff]avored [Nn]ation|MFN", text):
        mfn_match = re.search(r"(.{0,200}[Mm]ost [Ff]avored [Nn]ation.{0,200}|.{0,200}MFN.{0,200})", text)
        if mfn_match:
            clauses.append({
                "clause_type": "MFN (Most Favored Nation)",
                "rate": None,
                "discount": None,
                "threshold": None,
                "threshold_amount": None,
                "effective_date": None,
                "section_ref": None,
                "page_number": None,
                "clause_text": mfn_match.group(1).strip(),
                "confidence": 0.7,
                "notes": "MFN clause detected (mock mode)"
            })
    
    # Check for co-investment
    if re.search(r"[Cc]o.?[Ii]nvestment", text):
        coinvest_match = re.search(r"(.{0,200}[Cc]o.?[Ii]nvestment.{0,200})", text)
        if coinvest_match:
            clauses.append({
                "clause_type": "Co-investment Rights",
                "rate": None,
                "discount": None,
                "threshold": None,
                "threshold_amount": None,
                "effective_date": None,
                "section_ref": None,
                "page_number": None,
                "clause_text": coinvest_match.group(1).strip(),
                "confidence": 0.7,
                "notes": "Co-investment rights detected (mock mode)"
            })
    
    # Detect document type
    doc_type = "Unknown"
    if re.search(r"[Ss]ide [Ll]etter", text):
        doc_type = "Side Letter"
    elif re.search(r"[Ss]ubscription [Aa]greement", text):
        doc_type = "Subscription Agreement"
    elif re.search(r"[Aa]mendment", text):
        doc_type = "Amendment"
    elif re.search(r"PPM|[Pp]rivate [Pp]lacement", text):
        doc_type = "PPM"
    elif re.search(r"[Ff]ee [Ss]chedule", text):
        doc_type = "Fee Schedule"
    
    return {
        "document_info": {
            "detected_type": doc_type,
            "detected_investor": None,
            "detected_fund": None,
            "effective_date": None
        },
        "clauses": clauses,
        "extraction_notes": "Extracted using pattern matching (mock mode - no AI API configured)"
    }
