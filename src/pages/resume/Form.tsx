import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import Logo from '@/components/Logo';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from 'sonner';
import { ParsedResumeData } from '@/services/resumeParser';

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
          Best_Fit_For: typeof data.Best_Fit_For === "string" ? data.Best_Fit_For : "",
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
      if (field === "PG_InstituteName") {
        setFormData(data => ({ ...data!, PG_InstituteName: value.trim() === "" ? "nil" : value }) as ExtendedParsedResumeData);
      }
      if (field === "PHD_InstituteName") {
        setPhdPresent(value.trim() !== "" ? 1 : 0);
      }
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
      if (field === "Workshops") setFormData(data => ({ ...data!, Workshops: items }) as ExtendedParsedResumeData);
      if (field === "Trainings") setFormData(data => ({ ...data!, Trainings: items }) as ExtendedParsedResumeData);
    }
  };

  const handleSubmit = () => {
    let avgExp = 0;
    if (formData && formData.No_of_Jobs && formData.Longevity_Years) {
      avgExp = formData.No_of_Jobs > 0 ? Number((formData.Longevity_Years / formData.No_of_Jobs).toFixed(2)) : 0;
    }
    const dataToSave = {
      ...formData,
      PG_InstituteName: formData?.PG_InstituteName?.trim() === "" ? "nil" : formData?.PG_InstituteName,
      PHD_InstituteName: phdPresent === 1 ? formData?.PHD_InstituteName : "",
      Experience_Average: avgExp,
    };
    localStorage.setItem('parsed_resume_data', JSON.stringify(dataToSave));
    toast.success('Resume data saved successfully!');
    navigate('/assessment');
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

  const ug = formData.UG_InstituteName || "0";
  const pg = !formData.PG_InstituteName || formData.PG_InstituteName === "" ? "nil" : formData.PG_InstituteName;
  const phdName = phdPresent === 1 ? (formData.PHD_InstituteName || "0") : "0";

  const skillsArr = Array.isArray(formData.Skills) ? formData.Skills : [];
  const skillsLine = skillsArr.length > 0 ? skillsArr.join(', ') : "0";
  const skillsNo = skillsArr.length;

  const achArr = Array.isArray(formData.Achievements) ? formData.Achievements : [];
  const achLine = achArr.length > 0 ? achArr.join(', ') : "0";
  const achNo = achArr.length;

  const projectArr = Array.isArray(formData.Projects) ? formData.Projects : [];
  const projectLine = projectArr.length > 0 ? projectArr.join(', ') : "0";
  const projectsNo = projectArr.length;

  const workshopArr = Array.isArray(formData.Workshops) ? formData.Workshops : [];
  const workshopLine = workshopArr.length > 0 ? workshopArr.join(', ') : "0";
  const workshopsNo = workshopArr.length;

  const trainingArr = Array.isArray(formData.Trainings) ? formData.Trainings : [];
  const trainingLine = trainingArr.length > 0 ? trainingArr.join(', ') : "0";
  const trainingsNo = trainingArr.length;

  const papers = typeof formData.Total_Papers === "number" ? formData.Total_Papers : 0;
  const patents = typeof formData.Total_Patents === "number" ? formData.Total_Patents : 0;
  const books = typeof formData.Books === "number" ? formData.Books : 0;

  const noJobs = typeof formData.No_of_Jobs === "number" ? formData.No_of_Jobs : 0;
  const stateJK = typeof formData.State_JK === "number" ? formData.State_JK : 0;

  const longevity = typeof formData.Longevity_Years === "number" ? formData.Longevity_Years : 0;
  const avgExperience = noJobs > 0 ? Number((longevity / noJobs).toFixed(2)) : 0;

  return (
    <div className="min-h-screen bg-[#0F111A] text-white p-4">
      <div className="max-w-4xl mx-auto py-8">
        <div className="bg-[#1A1F2C] rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-center mb-8">Review Resume Information</h2>
          <Card className="bg-[#1A1F2C] border-gray-800">
            <CardContent className="p-8 space-y-1">
              <form className="space-y-4">
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
                  <Label className="w-1/3">PHD Institute (1 = Yes, 0 = No)</Label>
                  <Input
                    value={phdPresent}
                    onChange={e => {
                      const val = Number(e.target.value);
                      setPhdPresent(val);
                      handleInputChange('PHD_InstituteName', val === 1 ? (formData.PHD_InstituteName || "") : "");
                    }}
                    type="number"
                    min={0}
                    max={1}
                    className="bg-[#0F111A] border-gray-700"
                    autoComplete="off"
                  />
                </div>
                {phdPresent === 1 && (
                  <div className="flex gap-4 items-center w-full">
                    <Label className="w-1/3">PHD Institute Name</Label>
                    <Input
                      value={formData.PHD_InstituteName || ""}
                      onChange={e => handleInputChange('PHD_InstituteName', e.target.value)}
                      className="bg-[#0F111A] border-gray-700"
                      autoComplete="off"
                    />
                  </div>
                )}
                <div className="flex gap-4 items-center w-full">
                  <Label className="w-1/3">No. of Unique Jobs</Label>
                  <Input
                    type="number"
                    value={noJobs}
                    onChange={e => handleInputChange('No_of_Jobs', Number(e.target.value))}
                    className="bg-[#0F111A] border-gray-700"
                    min={0}
                  />
                </div>
                <div className="flex gap-4 items-center w-full">
                  <Label className="w-1/3">Work Experience (Years)</Label>
                  <Input
                    type="number"
                    value={longevity}
                    onChange={e => handleInputChange('Longevity_Years', Number(e.target.value))}
                    className="bg-[#0F111A] border-gray-700"
                    min={0}
                  />
                </div>
                <div className="flex gap-4 items-center w-full">
                  <Label className="w-1/3">Average Experience per Job</Label>
                  <Input
                    type="number"
                    value={avgExperience}
                    disabled
                    className="bg-[#0F111A] border-gray-700"
                  />
                </div>
                <div className="flex gap-4 items-center w-full">
                  <Label className="w-1/3">Skills No.</Label>
                  <Input
                    type="number"
                    value={skillsNo}
                    disabled
                    className="bg-[#0F111A] border-gray-700"
                  />
                </div>
                <div className="flex gap-4 items-center w-full">
                  <Label className="w-1/3">Skills</Label>
                  <Input
                    value={skillsLine}
                    onChange={e => handleCommaSeparatedInputChange('Skills', e.target.value)}
                    className="bg-[#0F111A] border-gray-700"
                    autoComplete="off"
                    placeholder="e.g. Python, JS"
                  />
                </div>
                <div className="flex gap-4 items-center w-full">
                  <Label className="w-1/3">Achievements No.</Label>
                  <Input
                    type="number"
                    value={achNo}
                    disabled
                    className="bg-[#0F111A] border-gray-700"
                  />
                </div>
                <div className="flex gap-4 items-center w-full">
                  <Label className="w-1/3">Achievements</Label>
                  <Input
                    value={achLine}
                    onChange={e => handleCommaSeparatedInputChange('Achievements', e.target.value)}
                    className="bg-[#0F111A] border-gray-700"
                    autoComplete="off"
                    placeholder="e.g. Award, Prize"
                  />
                </div>
                <div className="flex gap-4 items-center w-full">
                  <Label className="w-1/3">Projects No.</Label>
                  <Input
                    type="number"
                    value={projectsNo}
                    disabled
                    className="bg-[#0F111A] border-gray-700"
                  />
                </div>
                <div className="flex gap-4 items-center w-full">
                  <Label className="w-1/3">Projects</Label>
                  <Input
                    value={projectLine}
                    onChange={e => handleCommaSeparatedInputChange('Projects', e.target.value)}
                    className="bg-[#0F111A] border-gray-700"
                    autoComplete="off"
                    placeholder="e.g. Project1, Project2"
                  />
                </div>
                <div className="flex gap-4 items-center w-full">
                  <Label className="w-1/3">Workshops No.</Label>
                  <Input
                    type="number"
                    value={workshopsNo}
                    disabled
                    className="bg-[#0F111A] border-gray-700"
                  />
                </div>
                <div className="flex gap-4 items-center w-full">
                  <Label className="w-1/3">Workshops</Label>
                  <Input
                    value={workshopLine}
                    onChange={e => handleCommaSeparatedInputChange('Workshops', e.target.value)}
                    className="bg-[#0F111A] border-gray-700"
                    autoComplete="off"
                    placeholder="e.g. Workshop A, Workshop B"
                  />
                </div>
                <div className="flex gap-4 items-center w-full">
                  <Label className="w-1/3">Trainings No.</Label>
                  <Input
                    type="number"
                    value={trainingsNo}
                    disabled
                    className="bg-[#0F111A] border-gray-700"
                  />
                </div>
                <div className="flex gap-4 items-center w-full">
                  <Label className="w-1/3">Trainings</Label>
                  <Input
                    value={trainingLine}
                    onChange={e => handleCommaSeparatedInputChange('Trainings', e.target.value)}
                    className="bg-[#0F111A] border-gray-700"
                    autoComplete="off"
                    placeholder="e.g. Training X, Training Y"
                  />
                </div>
                <div className="flex gap-4 items-center w-full">
                  <Label className="w-1/3">State J&amp;K (1 = Yes, 0 = No)</Label>
                  <Input
                    type="number"
                    min={0}
                    max={1}
                    value={stateJK}
                    onChange={e => handleInputChange('State_JK', Number(e.target.value))}
                    className="bg-[#0F111A] border-gray-700"
                  />
                </div>
                <div className="flex gap-4 items-center w-full">
                  <Label className="w-1/3">Papers</Label>
                  <Input
                    type="number"
                    value={papers}
                    onChange={e => handleInputChange('Total_Papers', Number(e.target.value))}
                    className="bg-[#0F111A] border-gray-700"
                  />
                </div>
                <div className="flex gap-4 items-center w-full">
                  <Label className="w-1/3">Patents</Label>
                  <Input
                    type="number"
                    value={patents}
                    onChange={e => handleInputChange('Total_Patents', Number(e.target.value))}
                    className="bg-[#0F111A] border-gray-700"
                  />
                </div>
                <div className="flex gap-4 items-center w-full">
                  <Label className="w-1/3">Books</Label>
                  <Input
                    type="number"
                    value={books}
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
    </div>
  );
};

export default ResumeForm;
