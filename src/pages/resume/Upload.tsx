import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { FileIcon } from "lucide-react";
import { extractTextFromResume, parseResumeWithGemini } from '../../services/resumeParser';

const ResumeUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [isParseComplete, setIsParseComplete] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a PDF, DOCX, or TXT file');
      return;
    }
    
    setFile(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async () => {
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }

    setIsUploading(true);

    try {
      const resumeText = await extractTextFromResume(file);
      
      setIsUploading(false);
      setIsParsing(true);
      
      const parsedData = await parseResumeWithGemini(resumeText);
      
      localStorage.setItem('parsed_resume_data', JSON.stringify(parsedData));
      
      setIsParsing(false);
      setIsParseComplete(true);
      
      toast.success('Resume parsed successfully!');
    } catch (error: any) {
      console.error('Error:', error);
      setIsUploading(false);
      setIsParsing(false);
      toast.error(error.message || 'Failed to process the resume. Please try again.');
    }
  };

  const goToForm = () => {
    navigate('/resume/form');
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#0F111A] text-white p-4">
      <div className="w-full max-w-5xl flex justify-center flex-col items-center my-10">
        <div className="bg-[#1A1F2C] rounded-2xl p-8 w-full max-w-xl">
          <div className="flex items-center justify-center mb-6">
            <FileIcon className="mr-2 text-purple-light" size={24} />
            <h2 className="text-2xl font-semibold text-white">Upload Resume</h2>
          </div>
          
          <div 
            className={`border-2 border-dashed ${isDragging ? 'border-purple-light bg-purple-light/5' : 'border-purple/30'} 
            rounded-2xl p-10 flex items-center justify-center text-center cursor-pointer transition-all`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleUploadClick}
          >
            {file ? (
              <div className="flex items-center">
                <FileIcon size={20} className="mr-2 text-purple-light" />
                <span>{file.name}</span>
              </div>
            ) : (
              <div>
                <p>Drag & Drop Resume Here or Click to Upload</p>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept=".pdf,.docx,.txt"
            />
          </div>
          
          {isParseComplete ? (
            <div className="mt-4 p-4 bg-teal-900/20 border border-teal-500/30 rounded-lg text-center">
              <div className="flex items-center justify-center text-teal-400 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                Resume parsed and appended successfully!
              </div>
              <p className="text-teal-300">Click "Next →" to proceed.</p>
            </div>
          ) : isParsing ? (
            <div className="mt-4 p-4 bg-gray-800/50 border border-gray-700 rounded-lg text-center">
              <div className="flex items-center justify-center text-yellow-400">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Parsing Resume... Please wait
              </div>
            </div>
          ) : null}
          
          <div className="mt-4">
            {!isParseComplete ? (
              <Button
                onClick={handleSubmit}
                className="w-full bg-purple hover:bg-purple/80 text-white py-6 rounded-full"
                disabled={!file || isUploading || isParsing}
              >
                {isUploading ? 'Uploading...' : 'Upload'}
              </Button>
            ) : (
              <div className="flex justify-end">
                <Button
                  onClick={goToForm}
                  className="bg-purple hover:bg-purple/80 text-white px-8 py-2 rounded-full"
                >
                  Next →
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeUpload;
