export interface WorkExperienceData {
  id: string;
  companyName: string;
  position: string;
  startDate: Date;
  endDate: Date | null;
  isPresent: boolean;
  description: string | null;
  location: string | null;
}
