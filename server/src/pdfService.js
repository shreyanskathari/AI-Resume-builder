import pdfParse from 'pdf-parse';
import { parseResumeText } from './aiService.js';

export async function parsePdfResume(buffer) {
  try {
    const data = await pdfParse(buffer);
    const rawText = data.text;
    
    if (!rawText || rawText.trim().length === 0) {
      throw new Error('PDF appears to be empty or contains scanned images without text.');
    }

    const structured = await parseResumeText({ text: rawText });
    return {
      success: true,
      textLength: rawText.length,
      pageCount: data.numpages,
      parsedData: structured,
      rawText: rawText.slice(0, 500) + (rawText.length > 500 ? '...' : '')
    };
  } catch (err) {
    console.error('[PDF Service] Error parsing PDF:', err.message);
    throw new Error(err.message || 'Failed to parse PDF resume.');
  }
}
