import { Skill } from "../skills/skill.types";

export interface Project {
  id: string;
  title: string;
  description: string | null;
  link: string | null;
  projectImage: string | null;
  techStack: {
    skill: Skill;
  }[];
  createdAt: string;
  updatedAt: string;
}
