export interface WorkExperience {
  id: string;
  companyName: string;
  position: string;
  startDate: string; // ISO string
  endDate: string | null;
  isPresent: boolean;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}
