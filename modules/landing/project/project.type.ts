export type ProjectItem = {
  id: string;
  title: string;
  link: string | null;
  description: string | null;
  projectImage: string | null;
  skills: {
    id: string;
    name: string;
    photo: string;
  }[];
};

export type ProjectResponse = {
  items: ProjectItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
