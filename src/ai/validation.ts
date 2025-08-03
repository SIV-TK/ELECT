// src/ai/validation.ts
export interface AIResponse {
  text?: string;
  candidates?: Array<{
    message?: {
      content?: string;
      text?: string;
    };
  }>;
  custom?: {
    choices?: Array<{
      message?: {
        content?: string;
      };
    }>;
  };
  output?: any; // For Genkit responses
  [key: string]: any;
}

export function validateAIResponse(response: any): string {
  if (!response) {
    throw new Error('No AI response received');
  }
  
  // Handle different response formats
  let text: string | undefined;
  
  // Check Genkit output format first
  if (response.output && typeof response.output === 'string') {
    text = response.output;
  }
  // Check direct text property
  else if (response.text && typeof response.text === 'string') {
    text = response.text;
  }
  // Check custom.choices format (DeepSeek direct API)
  else if (response.custom?.choices?.[0]?.message?.content) {
    text = response.custom.choices[0].message.content;
  }
  // Check candidates format (Genkit wrapper)
  else if (response.candidates?.[0]?.message?.content) {
    text = response.candidates[0].message.content;
  }
  else if (response.candidates?.[0]?.message?.text) {
    text = response.candidates[0].message.text;
  }
  
  if (!text || typeof text !== 'string') {
    throw new Error('Invalid AI response format');
  }
  
  const cleanText = text.trim();
  if (cleanText.length === 0) {
    throw new Error('Empty AI response');
  }
  
  return cleanText;
}

export function parseJSONResponse<T>(responseText: string, fallback: T): T {
  try {
    // Clean the response text
    let jsonText = responseText.trim();
    
    // Remove markdown code blocks if present
    jsonText = jsonText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    jsonText = jsonText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    
    // Extract JSON from response if wrapped in other text
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonText = jsonMatch[0];
    }
    
    const parsed = JSON.parse(jsonText);
    
    // Basic validation that it's an object
    if (typeof parsed !== 'object' || parsed === null) {
      throw new Error('Parsed result is not an object');
    }
    
    return parsed as T;
  } catch (error) {
    console.warn('Failed to parse JSON response:', error);
    return fallback;
  }
}

export function validateStringField(value: any, fallback: string): string {
  return (value && typeof value === 'string' && value.trim().length > 0) 
    ? value.trim() 
    : fallback;
}

export function validateArrayField(value: any, fallback: string[]): string[] {
  if (Array.isArray(value) && value.length > 0) {
    return value.filter((item: any) => typeof item === 'string' && item.trim().length > 0);
  }
  return fallback;
}

export function validateNumberField(value: any, fallback: number, min?: number, max?: number): number {
  if (typeof value === 'number' && !isNaN(value)) {
    let result = value;
    if (min !== undefined) result = Math.max(min, result);
    if (max !== undefined) result = Math.min(max, result);
    return result;
  }
  return fallback;
}