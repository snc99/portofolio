export interface SkillData {
  id: string;
  name: string;
  photo: string;
  level: "JUNIOR" | "INTERMEDIATE" | "SENIOR" | "EXPERT";
}

export interface SkillResponse {
  data: SkillData[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
