export interface ProfileData {
  id: string;
  motto: string;
  cvLink: string | null;
  cvFilename: string | null;
}

export interface AboutData {
  id: string;
  description: string;
}

export interface SkillData {
  id: string;
  name: string;
  photo: string;
}

export interface WorkExperienceData {
  id: string;
  companyName: string;
  position: string;
  startDate: string;
  endDate: string | null;
  isPresent: boolean;
  description: string | null;
}

export interface SocialMediaData {
  id: string;
  platform: string;
  url: string;
  photo: string;
}

export interface ProjectData {
  id: string;
  title: string;
  description: string | null;
  link: string | null;
  projectImage: string | null;
  skills: SkillData[];
}

export interface HomeData {
  profile: ProfileData | null;
  about: AboutData | null;
  skills: SkillData[];
  workExperience: WorkExperienceData[];
  projects: ProjectData[];
  socialMedia: SocialMediaData[];
}
