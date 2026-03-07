export interface WorkExperience {
  id: string;
  companyName: string;
  position: string;
  location?: string;
  startDate: string;
  endDate: string | null;
  isPresent: boolean;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}
