
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import Logo from '@/components/Logo';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from 'sonner';
import { ParsedResumeData } from '@/services/resumeParser';

// Adds PHD_InstituteName (as string) to local type
type ExtendedParsedResumeData = ParsedResumeData & {
  PHD_InstituteName?: string;
};

const getPhdInstituteValue = (data: any): { phdName: string, phdPresent: number } => {
  if (data && typeof data.PHD_InstituteName === "string" && data.PHD_InstituteName.trim() !== "") {
    return { phdName: data.PHD_InstituteName, phdPresent: 1 };
  }
  return { phdName: '', phdPresent: 0 };
};

const ResumeForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ExtendedParsedResumeData | null>(null);
  const [phdPresent, setPhdPresent] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const parsedData = localStorage.getItem('parsed_resume_data');
    if (parsedData) {
      try {
        const data = JSON.parse(parsedData);

        // Populate PhD information if present, else 0
        const phd = getPhdInstituteValue(data);

        setPhdPresent(phd.phdPresent)
        setFormData({
          UG_InstituteName: data.UG_InstituteName || '',
          PG_InstituteName: data.PG_InstituteName === undefined || data.PG_InstituteName === '' ? 'nil' : data.PG_InstituteName,
          PHD_InstituteName: phd.phdName,
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
          // Best_Fit_For is removed from the UI
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

  const handleInputChange = (field: keyof ExtendedParsedResumeData, value: any) => {
    if (formData) {
      setFormData({
        ...formData,
        [field]: value
      });
    }
    // If PG is edited to empty string, store "nil"
    if (field === "PG_InstituteName" && value.trim() === "") {
      setFormData({...formData!, PG_InstituteName: "nil"});
    }
    // For PhD, set phdPresent accordingly
    if (field === "PHD_InstituteName") {
      setPhdPresent(value.trim() !== "" ? 1 : 0);
    }
  };

  const handleCommaSeparatedInputChange = (field: keyof ParsedResumeData, value: string) => {
    const items = value.trim() === "" ? [] : value.split(',').map(item => item.trim()).filter(Boolean);
    if (formData) {
      setFormData({
        ...formData,
        [field]: items
      });
      if (field === "Skills") setFormData(data => ({ ...data!, Skills_No: items.length }) as ExtendedParsedResumeData);
      if (field === "Achievements") setFormData(data => ({ ...data!, Achievements_No: items.length }) as ExtendedParsedResumeData);
      if (field === "Projects") setFormData(data => ({ ...data!, Projects_No: items.length }) as ExtendedParsedResumeData);
    }
  };

  const handleSubmit = () => {
    let avgExp = 0;
    if (formData && formData.No_of_Jobs && formData.Longevity_Years) {
      avgExp = formData.No_of_Jobs > 0 ? Number((formData.Longevity_Years / formData.No_of_Jobs).toFixed(2)) : 0;
    }
    // Still store "nil" for empty PG
    const dataToSave = {
      ...formData,
      PG_InstituteName: formData?.PG_InstituteName?.trim() === "" ? "nil" : formData?.PG_InstituteName,
      PHD_InstituteName: formData?.PHD_InstituteName,
      Experience_Average: avgExp,
      // Best_Fit_For is not saved here anymore
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

  // Get display values, with "0" (or empty arrays as "0") as per requirements
  const ug = formData.UG_InstituteName || "0";
  const pg = formData.PG_InstituteName || "nil";
  const phdName = formData.PHD_InstituteName || "";
  const skillsLine = (formData.Skills && formData.Skills.length > 0)
    ? formData.Skills.join(', ')
    : "0";
  const achLine = (formData.Achievements && formData.Achievements.length > 0)
    ? formData.Achievements.join(', ')
    : "0";
  const projectLine = (formData.Projects && formData.Projects.length > 0)
    ? formData.Projects.join(', ')
    : "0";
  const workshopLine = (formData.Workshops && formData.Workshops.length > 0) ? formData.Workshops.join(', ') : "0";
  const trainingLine = (formData.Trainings && formData.Trainings.length > 0) ? formData.Trainings.join(', ') : "0";

  return (
    <div className="min-h-screen bg-[#0F111A] text-white p-4">
      <div className="container mx-auto max-w-3xl my-8">
        <div className="flex items-center justify-center mb-8"><Logo /></div>
        <h1 className="text-3xl font-bold mb-8 text-center text-purple-light">Review Your Resume Information</h1>
        <Card className="bg-[#1A1F2C] border-gray-800">
          <CardContent className="p-8">
            <form className="space-y-4">
              {/* Education */}
              <div className="flex gap-4 items-center w-full">
                <Label className="w-1/3">Undergraduate Institute</Label>
                <Input
                  value={ug}
                  onChange={e => handleInputChange('UG_InstituteName', e.target.value)}
                  className="bg-[#0F111A] border-gray-700"
                  autoComplete="off"
                />
              </div>
              <div className="flex gap-4 items-center w-full">
                <Label className="w-1/3">Postgraduate Institute</Label>
                <Input
                  value={pg}
                  onChange={e => handleInputChange('PG_InstituteName', e.target.value)}
                  className="bg-[#0F111A] border-gray-700"
                  autoComplete="off"
                />
              </div>
              <div className="flex gap-4 items-center w-full">
                <Label className="w-1/3">PHD Institute</Label>
                <Input
                  value={phdPresent}
                  onChange={e => {
                    const v = e.target.value === "1" ? (formData.PHD_InstituteName || "Some Institute") : "";
                    handleInputChange('PHD_InstituteName', v)
                  }}
                  type="number"
                  min={0}
                  max={1}
                  className="bg-[#0F111A] border-gray-700"
                  autoComplete="off"
                />
              </div>

              {/* Work Experience */}
              <div className="flex gap-4 items-center w-full">
                <Label className="w-1/3">Work Experience (Years)</Label>
                <Input
                  type="number"
                  value={formData.Longevity_Years || 0}
                  onChange={e => handleInputChange('Longevity_Years', Number(e.target.value))}
                  className="bg-[#0F111A] border-gray-700"
                />
              </div>
              <div className="flex gap-4 items-center w-full">
                <Label className="w-1/3">Number of Jobs</Label>
                <Input
                  type="number"
                  value={formData.No_of_Jobs || 0}
                  onChange={e => handleInputChange('No_of_Jobs', Number(e.target.value))}
                  className="bg-[#0F111A] border-gray-700"
                />
              </div>
              <div className="flex gap-4 items-center w-full">
                <Label className="w-1/3">Average Experience per Job</Label>
                <Input
                  type="number"
                  value={
                    formData.No_of_Jobs && formData.No_of_Jobs > 0
                      ? Number((formData.Longevity_Years / formData.No_of_Jobs).toFixed(2))
                      : 0
                  }
                  disabled
                  className="bg-[#0F111A] border-gray-700"
                />
              </div>

              {/* Skills, Achievements, Projects, Workshops, Trainings, State */}
              <div className="flex gap-4 items-center w-full">
                <Label className="w-1/3">Skills</Label>
                <Input
                  value={skillsLine}
                  onChange={e => handleCommaSeparatedInputChange('Skills', e.target.value)}
                  className="bg-[#0F111A] border-gray-700"
                  autoComplete="off"
                />
              </div>
              <div className="flex gap-4 items-center w-full">
                <Label className="w-1/3">Achievements</Label>
                <Input
                  value={achLine}
                  onChange={e => handleCommaSeparatedInputChange('Achievements', e.target.value)}
                  className="bg-[#0F111A] border-gray-700"
                  autoComplete="off"
                />
              </div>
              <div className="flex gap-4 items-center w-full">
                <Label className="w-1/3">Projects</Label>
                <Input
                  value={projectLine}
                  onChange={e => handleCommaSeparatedInputChange('Projects', e.target.value)}
                  className="bg-[#0F111A] border-gray-700"
                  autoComplete="off"
                />
              </div>
              <div className="flex gap-4 items-center w-full">
                <Label className="w-1/3">Workshops</Label>
                <Input
                  value={workshopLine}
                  onChange={e => handleCommaSeparatedInputChange('Workshops', e.target.value)}
                  className="bg-[#0F111A] border-gray-700"
                  autoComplete="off"
                />
              </div>
              <div className="flex gap-4 items-center w-full">
                <Label className="w-1/3">Trainings</Label>
                <Input
                  value={trainingLine}
                  onChange={e => handleCommaSeparatedInputChange('Trainings', e.target.value)}
                  className="bg-[#0F111A] border-gray-700"
                  autoComplete="off"
                />
              </div>
              <div className="flex gap-4 items-center w-full">
                <Label className="w-1/3">State J&amp;K (1 = Yes, 0 = No)</Label>
                <Input
                  type="number"
                  min={0}
                  max={1}
                  value={formData.State_JK ?? 0}
                  onChange={e => handleInputChange('State_JK', Number(e.target.value))}
                  className="bg-[#0F111A] border-gray-700"
                />
              </div>

              {/* Research / Publications / Books */}
              <div className="flex gap-4 items-center w-full">
                <Label className="w-1/3">Papers</Label>
                <Input
                  type="number"
                  value={formData.Total_Papers ?? 0}
                  onChange={e => handleInputChange('Total_Papers', Number(e.target.value))}
                  className="bg-[#0F111A] border-gray-700"
                />
              </div>
              <div className="flex gap-4 items-center w-full">
                <Label className="w-1/3">Patents</Label>
                <Input
                  type="number"
                  value={formData.Total_Patents ?? 0}
                  onChange={e => handleInputChange('Total_Patents', Number(e.target.value))}
                  className="bg-[#0F111A] border-gray-700"
                />
              </div>
              <div className="flex gap-4 items-center w-full">
                <Label className="w-1/3">Books</Label>
                <Input
                  type="number"
                  value={formData.Books ?? 0}
                  onChange={e => handleInputChange('Books', Number(e.target.value))}
                  className="bg-[#0F111A] border-gray-700"
                />
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
