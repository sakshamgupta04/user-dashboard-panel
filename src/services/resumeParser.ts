
import { GoogleGenerativeAI } from '@google/generative-ai';

// Set up API key (in a real app, this would be stored securely)
const API_KEY = 'AIzaSyAUyQ3aCQujGFpfE-2vPtOzIXJaeM15e00'; // This should be in an environment variable
const genAI = new GoogleGenerativeAI(API_KEY);

export interface ParsedResumeData {
  UG_InstituteName: string;
  PG_InstituteName: string;
  Longevity_Years: number;
  Workshops: string[];
  Trainings: string[];
  Achievements_No: number;
  Achievements: string[];
  Skills_No: number;
  Skills: string[];
  Projects_No: number;
  Projects: string[];
  Total_Papers: number;
  Total_Patents: number;
  Books: number;
  State_JK: number;
  No_of_Jobs: number;
  Experience_Average: number;
  Best_Fit_For: string;
}

// Function to read text from PDF file
export const extractTextFromPdf = async (file: File): Promise<string> => {
  try {
    // Using pdfjs to extract text
    const { getDocument } = await import('pdfjs-dist');
    
    // Convert file to array buffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Load the PDF document
    const pdf = await getDocument({ data: arrayBuffer }).promise;
    
    let text = '';
    
    // Extract text from each page
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map((item: any) => item.str).join(' ');
      text += pageText + '\n';
    }
    
    return text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
};

// Function to read text from DOCX file
export const extractTextFromDocx = async (file: File): Promise<string> => {
  try {
    const { default: DocxParser } = await import('docx-parser');
    
    // Convert file to array buffer
    const arrayBuffer = await file.arrayBuffer();
    
    return new Promise((resolve, reject) => {
      DocxParser.parseDocx(arrayBuffer, function(text: string) {
        resolve(text);
      }, function(error: any) {
        reject(error);
      });
    });
  } catch (error) {
    console.error('Error extracting text from DOCX:', error);
    throw new Error('Failed to extract text from DOCX');
  }
};

// Function to extract text from resume file
export const extractTextFromResume = async (file: File): Promise<string> => {
  if (file.type === 'application/pdf') {
    return extractTextFromPdf(file);
  } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    return extractTextFromDocx(file);
  } else if (file.type === 'text/plain') {
    return file.text();
  } else {
    throw new Error('Unsupported file type');
  }
};

// Function to parse resume text using Gemini AI
export const parseResumeWithGemini = async (resumeText: string): Promise<ParsedResumeData> => {
  try {
    // Initialize the model
    const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-pro" });
    
    // Create the prompt for Gemini
    const prompt = `
    Extract the following fields in JSON format (strictly use double quotes for all keys and values):

    - UG_InstituteName
    - PG_InstituteName
    - Longevity_Years
    - Workshops
    - Trainings
    - Achievements_No.
    - Achievements
    - Skills_No.
    - Skills
    - Projects_No.
    - Projects
    - Total_Papers
    - Total_Patents
    - Books
    - State_J&K (1 for yes, 0 for no)
    - No. of Jobs
    - Experience_Average (Longevity_Years / No. of Jobs)
    - Best_Fit_For (Suggest a Computer Science job role suitable for the candidate)

    Resume:
    ${resumeText}
    `;
    
    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('No JSON found in the Gemini response');
    }
    
    const parsedData = JSON.parse(jsonMatch[0]);
    return parsedData as ParsedResumeData;
  } catch (error) {
    console.error('Error parsing resume with Gemini:', error);
    throw new Error('Failed to parse resume');
  }
};
