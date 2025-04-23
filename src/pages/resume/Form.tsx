
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
    const parsedData = localStorage.getItem('parsed_resume_data');
    if (parsedData) {
      try {
        const data = JSON.parse(parsedData);

        // Initialize robustly, defaulting arrays to comma-separated strings, numbers to 0
        setFormData({
          UG_InstituteName: data.UG_InstituteName || '',
          PG_InstituteName: data.PG_InstituteName || '',
          Longevity_Years: typeof data.Longevity_Years === "number" ? data.Longevity_Years : 0,
          Workshops: Array.isArray(data.Workshops) ? data.Workshops : [],
          Trainings: Array.isArray(data.Trainings) ? data.Trainings : [],
          Achievements_No: typeof data.Achievements_No === "number" ? data.Achievements_No : 0,
          Achievements: Array.isArray(data.Achievements) ? data.Achievements : [],
          Skills_No: typeof data.Skills_No === "number" ? data.Skills_No : 0,
          Skills: Array.isArray(data.Skills) ? data.Skills : [],
          Projects_No: typeof data.Projects_No === "number" ? data.Projects_No : 0,
          Projects: Array.isArray(data.Projects) ? data.Projects : [],
          Total_Papers: typeof data.Total_Papers === "number" ? data.Total_Papers : 0,
          Total_Patents: typeof data.Total_Patents === "number" ? data.Total_Patents : 0,
          Books: typeof data.Books === "number" ? data.Books : 0,
          State_JK: typeof data.State_JK === "number" ? data.State_JK : 0,
          No_of_Jobs: typeof data.No_of_Jobs === "number" ? data.No_of_Jobs : 0,
          Experience_Average: typeof data.Experience_Average === "number" ? data.Experience_Average : 0,
          Best_Fit_For: '', // will not be used anymore in the UI
        });
      } catch (error) {
        toast.error('Error parsing resume data. Please try again.');
        navigate('/resume/upload');
      }
    } else {
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

  const handleCommaSeparatedInputChange = (field: keyof ParsedResumeData, value: string) => {
    const items = value.split(',').map(item => item.trim()).filter(Boolean);
    if (formData) {
      setFormData({
        ...formData,
        [field]: items
      });
    }
    // If user edits skill string, Skills_No and Achievements_No should follow
    if (field === "Skills" && formData) {
      setFormData(data => ({
        ...data!,
        Skills_No: items.length
      }) as ParsedResumeData);
    }
    if (field === "Achievements" && formData) {
      setFormData(data => ({
        ...data!,
        Achievements_No: items.length
      }) as ParsedResumeData);
    }
    if (field === "Workshops" && formData) {
      setFormData(data => ({
        ...data!,
        Workshops: items
      }) as ParsedResumeData);
    }
    if (field === "Trainings" && formData) {
      setFormData(data => ({
        ...data!,
        Trainings: items
      }) as ParsedResumeData);
    }
  };

  const handleSubmit = () => {
    // Calculate average experience (just in case)
    let avgExp = 0;
    if (formData && formData.No_of_Jobs && formData.Longevity_Years) {
      avgExp = formData.No_of_Jobs > 0 ? Number((formData.Longevity_Years / formData.No_of_Jobs).toFixed(2)) : 0;
    }
    const dataToSave = {
      ...formData,
      Experience_Average: avgExp,
      Best_Fit_For: '', // remove role suggestion at this step
    };
    localStorage.setItem('parsed_resume_data', JSON.stringify(dataToSave));
    toast.success('Resume data saved successfully!');
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

  // String representations for skills, achievements, workshops, trainings
  const skillsStr = Array.isArray(formData.Skills) && formData.Skills.length > 0 ? formData.Skills.join(', ') : '';
  const achievementsStr = Array.isArray(formData.Achievements) && formData.Achievements.length > 0 ? formData.Achievements.join(', ') : '';
  const projectsStr = Array.isArray(formData.Projects) && formData.Projects.length > 0 ? formData.Projects.join(', ') : '';
  const workshopsStr = Array.isArray(formData.Workshops) && formData.Workshops.length > 0 ? formData.Workshops.join(', ') : '';
  const trainingsStr = Array.isArray(formData.Trainings) && formData.Trainings.length > 0 ? formData.Trainings.join(', ') : '';

  return (
    <div className="min-h-screen bg-[#0F111A] text-white p-4">
      <div className="container mx-auto max-w-3xl my-8">
        <div className="flex items-center justify-center mb-8"><Logo /></div>
        <h1 className="text-3xl font-bold mb-8 text-center text-purple-light">Review Your Resume Information</h1>
        <Card className="bg-[#1A1F2C] border-gray-800">
          <CardContent className="p-8">
            <form className="space-y-8">
              {/* 1. Education */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="ug-institute">Undergraduate Institute</Label>
                  <Input 
                    id="ug-institute"
                    value={formData.UG_InstituteName || ''} 
                    onChange={(e) => handleInputChange('UG_InstituteName', e.target.value)}
                    className="bg-[#0F111A] border-gray-700 mt-1"
                    autoComplete="off"
                  />
                </div>
                <div>
                  <Label htmlFor="pg-institute">Postgraduate Institute</Label>
                  <Input 
                    id="pg-institute"
                    value={formData.PG_InstituteName || ''} 
                    onChange={(e) => handleInputChange('PG_InstituteName', e.target.value)}
                    className="bg-[#0F111A] border-gray-700 mt-1"
                    autoComplete="off"
                  />
                </div>
              </div>
              {/* 2. Work Experience */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="longevity">Work Experience (Years)</Label>
                  <Input 
                    id="longevity"
                    type="number"
                    value={formData.Longevity_Years || 0} 
                    onChange={(e) => handleInputChange('Longevity_Years', Number(e.target.value))}
                    className="bg-[#0F111A] border-gray-700 mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="jobs">Number of Jobs</Label>
                  <Input 
                    id="jobs"
                    type="number"
                    value={formData.No_of_Jobs || 0} 
                    onChange={(e) => handleInputChange('No_of_Jobs', Number(e.target.value))}
                    className="bg-[#0F111A] border-gray-700 mt-1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="avg-exp">Average Experience per Job</Label>
                  <Input 
                    id="avg-exp"
                    type="number"
                    value={
                      formData.No_of_Jobs && formData.No_of_Jobs > 0 
                        ? Number((formData.Longevity_Years / formData.No_of_Jobs).toFixed(2)) 
                        : 0
                    }
                    onChange={() => {}}
                    className="bg-[#0F111A] border-gray-700 mt-1"
                    disabled
                  />
                </div>
                <div>
                  <Label htmlFor="state-jk">State J&amp;K (1 = Yes, 0 = No)</Label>
                  <Input
                    id="state-jk"
                    type="number"
                    min={0}
                    max={1}
                    value={formData.State_JK ?? 0}
                    onChange={e => handleInputChange('State_JK', Number(e.target.value))}
                    className="bg-[#0F111A] border-gray-700 mt-1"
                  />
                </div>
              </div>
              {/* 3. Skills, Achievements */}
              <div>
                <Label htmlFor="skills">Skills<span className="text-xs text-gray-400 ml-2">(Comma separated)</span></Label>
                <Input
                  id="skills"
                  value={skillsStr}
                  onChange={e => handleCommaSeparatedInputChange('Skills', e.target.value)}
                  className="bg-[#0F111A] border-gray-700 mt-1"
                  autoComplete="off"
                />
              </div>
              <div>
                <Label htmlFor="achievements">Achievements<span className="text-xs text-gray-400 ml-2">(Comma separated)</span></Label>
                <Input
                  id="achievements"
                  value={achievementsStr}
                  onChange={e => handleCommaSeparatedInputChange('Achievements', e.target.value)}
                  className="bg-[#0F111A] border-gray-700 mt-1"
                  autoComplete="off"
                />
              </div>
              {/* 4. Workshops and Trainings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="workshops">Workshops <span className="text-xs text-gray-400 ml-1">(Comma separated, or 0 if none)</span></Label>
                  <Input
                    id="workshops"
                    value={workshopsStr || '0'}
                    onChange={e => handleCommaSeparatedInputChange('Workshops', e.target.value)}
                    className="bg-[#0F111A] border-gray-700 mt-1"
                    autoComplete="off"
                  />
                </div>
                <div>
                  <Label htmlFor="trainings">Trainings <span className="text-xs text-gray-400 ml-1">(Comma separated, or 0 if none)</span></Label>
                  <Input
                    id="trainings"
                    value={trainingsStr || '0'}
                    onChange={e => handleCommaSeparatedInputChange('Trainings', e.target.value)}
                    className="bg-[#0F111A] border-gray-700 mt-1"
                    autoComplete="off"
                  />
                </div>
              </div>
              {/* 5. Research / Publications / Books */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <Label htmlFor="total-papers">Papers</Label>
                  <Input
                    id="total-papers"
                    type="number"
                    value={formData.Total_Papers || 0}
                    onChange={e => handleInputChange('Total_Papers', Number(e.target.value))}
                    className="bg-[#0F111A] border-gray-700 mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="total-patents">Patents</Label>
                  <Input
                    id="total-patents"
                    type="number"
                    value={formData.Total_Patents || 0}
                    onChange={e => handleInputChange('Total_Patents', Number(e.target.value))}
                    className="bg-[#0F111A] border-gray-700 mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="books">Books</Label>
                  <Input
                    id="books"
                    type="number"
                    value={formData.Books || 0}
                    onChange={e => handleInputChange('Books', Number(e.target.value))}
                    className="bg-[#0F111A] border-gray-700 mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="projects">Projects <span className="text-xs text-gray-400 ml-1">(Comma separated)</span></Label>
                  <Textarea
                    id="projects"
                    value={projectsStr}
                    onChange={e => handleCommaSeparatedInputChange('Projects', e.target.value)}
                    className="bg-[#0F111A] border-gray-700 mt-1"
                    rows={2}
                  />
                </div>
              </div>
            </form>
            <div className="flex justify-end space-x-4 mt-8">
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResumeForm;
