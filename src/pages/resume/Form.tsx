
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import Logo from '@/components/Logo';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from 'sonner';
import { ParsedResumeData } from '@/services/resumeParser';

const ResumeForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ParsedResumeData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    // Get parsed resume data from localStorage
    const parsedData = localStorage.getItem('parsed_resume_data');
    
    if (parsedData) {
      try {
        const data = JSON.parse(parsedData);
        
        // Initialize any potentially missing arrays to prevent null mapping errors
        const safeData = {
          ...data,
          Skills: Array.isArray(data.Skills) ? data.Skills : [],
          Projects: Array.isArray(data.Projects) ? data.Projects : [],
          Achievements: Array.isArray(data.Achievements) ? data.Achievements : [],
          Workshops: Array.isArray(data.Workshops) ? data.Workshops : [],
          Trainings: Array.isArray(data.Trainings) ? data.Trainings : []
        };
        
        setFormData(safeData);
      } catch (error) {
        toast.error('Error parsing resume data. Please try again.');
        navigate('/resume/upload');
      }
    } else {
      // If no data, redirect back to upload page
      toast.error('No resume data found. Please upload your resume first.');
      navigate('/resume/upload');
    }
    
    setLoading(false);
  }, [navigate]);

  const handleInputChange = (field: keyof ParsedResumeData, value: any) => {
    if (formData) {
      setFormData({
        ...formData,
        [field]: value
      });
    }
  };

  const handleArrayInputChange = (field: keyof ParsedResumeData, index: number, value: string) => {
    if (formData) {
      const newArray = [...(formData[field] as string[])];
      newArray[index] = value;
      
      setFormData({
        ...formData,
        [field]: newArray
      });
    }
  };

  const handleSubmit = () => {
    // Save updated form data
    localStorage.setItem('parsed_resume_data', JSON.stringify(formData));
    toast.success('Resume data saved successfully!');
    // In a real app, you might want to send this data to a server or database
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F111A]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-light border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!formData) {
    return null;
  }

  // Ensure all array fields exist to prevent mapping errors
  const skills = formData.Skills || [];
  const projects = formData.Projects || [];
  const achievements = formData.Achievements || [];

  return (
    <div className="min-h-screen bg-[#0F111A] text-white p-4">
      <div className="container mx-auto max-w-4xl my-8">
        <div className="flex items-center justify-center mb-8">
          <Logo />
        </div>
        
        <h1 className="text-3xl font-bold mb-8 text-center text-purple-light">Review Your Resume Information</h1>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-[#1A1F2C] border-gray-800">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-purple-light">Education</h2>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="ug-institute">Undergraduate Institute</Label>
                    <Input 
                      id="ug-institute"
                      value={formData.UG_InstituteName || ''} 
                      onChange={(e) => handleInputChange('UG_InstituteName', e.target.value)}
                      className="bg-[#0F111A] border-gray-700"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="pg-institute">Postgraduate Institute</Label>
                    <Input 
                      id="pg-institute"
                      value={formData.PG_InstituteName || ''} 
                      onChange={(e) => handleInputChange('PG_InstituteName', e.target.value)}
                      className="bg-[#0F111A] border-gray-700"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-[#1A1F2C] border-gray-800">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-purple-light">Work Experience</h2>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="longevity">Experience (Years)</Label>
                    <Input 
                      id="longevity"
                      type="number"
                      value={formData.Longevity_Years || 0} 
                      onChange={(e) => handleInputChange('Longevity_Years', Number(e.target.value))}
                      className="bg-[#0F111A] border-gray-700"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="jobs">Number of Jobs</Label>
                    <Input 
                      id="jobs"
                      type="number"
                      value={formData.No_of_Jobs || 0} 
                      onChange={(e) => handleInputChange('No_of_Jobs', Number(e.target.value))}
                      className="bg-[#0F111A] border-gray-700"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="avg-exp">Average Experience per Job</Label>
                    <Input 
                      id="avg-exp"
                      type="number"
                      value={formData.Experience_Average || 0} 
                      onChange={(e) => handleInputChange('Experience_Average', Number(e.target.value))}
                      className="bg-[#0F111A] border-gray-700"
                      disabled
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="bg-[#1A1F2C] border-gray-800">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-purple-light">Skills</h2>
              
              <div className="space-y-4">
                {skills.map((skill, index) => (
                  <div key={`skill-${index}`}>
                    <Label htmlFor={`skill-${index}`}>Skill {index + 1}</Label>
                    <Input 
                      id={`skill-${index}`}
                      value={skill} 
                      onChange={(e) => handleArrayInputChange('Skills', index, e.target.value)}
                      className="bg-[#0F111A] border-gray-700"
                    />
                  </div>
                ))}
                {skills.length === 0 && (
                  <div className="text-gray-400">No skills found in resume</div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#1A1F2C] border-gray-800">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-purple-light">Projects</h2>
              
              <div className="space-y-4">
                {projects.map((project, index) => (
                  <div key={`project-${index}`}>
                    <Label htmlFor={`project-${index}`}>Project {index + 1}</Label>
                    <Textarea 
                      id={`project-${index}`}
                      value={project} 
                      onChange={(e) => handleArrayInputChange('Projects', index, e.target.value)}
                      className="bg-[#0F111A] border-gray-700"
                    />
                  </div>
                ))}
                {projects.length === 0 && (
                  <div className="text-gray-400">No projects found in resume</div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#1A1F2C] border-gray-800">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-purple-light">Achievements</h2>
              
              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <div key={`achievement-${index}`}>
                    <Label htmlFor={`achievement-${index}`}>Achievement {index + 1}</Label>
                    <Textarea 
                      id={`achievement-${index}`}
                      value={achievement} 
                      onChange={(e) => handleArrayInputChange('Achievements', index, e.target.value)}
                      className="bg-[#0F111A] border-gray-700"
                    />
                  </div>
                ))}
                {achievements.length === 0 && (
                  <div className="text-gray-400">No achievements found in resume</div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#1A1F2C] border-gray-800">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-purple-light">Career Analysis</h2>
              
              <div>
                <Label htmlFor="best-fit">Best Suited Role</Label>
                <Input 
                  id="best-fit"
                  value={formData.Best_Fit_For || ''} 
                  onChange={(e) => handleInputChange('Best_Fit_For', e.target.value)}
                  className="bg-[#0F111A] border-gray-700 mb-6"
                />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="total-papers">Research Papers</Label>
                    <Input 
                      id="total-papers"
                      type="number"
                      value={formData.Total_Papers || 0} 
                      onChange={(e) => handleInputChange('Total_Papers', Number(e.target.value))}
                      className="bg-[#0F111A] border-gray-700"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="total-patents">Patents</Label>
                    <Input 
                      id="total-patents"
                      type="number"
                      value={formData.Total_Patents || 0} 
                      onChange={(e) => handleInputChange('Total_Patents', Number(e.target.value))}
                      className="bg-[#0F111A] border-gray-700"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="books">Books Published</Label>
                    <Input 
                      id="books"
                      type="number"
                      value={formData.Books || 0} 
                      onChange={(e) => handleInputChange('Books', Number(e.target.value))}
                      className="bg-[#0F111A] border-gray-700"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end space-x-4">
            <Button
              onClick={() => navigate('/resume/upload')}
              variant="outline"
              className="border-purple text-purple-light hover:bg-purple/10"
            >
              Back
            </Button>
            
            <Button
              onClick={handleSubmit}
              className="bg-purple hover:bg-purple/80 text-white px-8 py-2"
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeForm;
