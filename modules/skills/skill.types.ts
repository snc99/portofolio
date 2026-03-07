export interface Skill {
  id: string;
  name: string;
  photo: string;
  level: "JUNIOR" | "INTERMEDIATE" | "SENIOR" | "EXPERT";
  createdAt: string;
  updatedAt: string;
}
