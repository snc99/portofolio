import { api } from "@/shared/api/axios";

export const workExperienceApi = {
  get: () => api.get("/work-experience"),

  create: (data: {
    companyName: string;
    position: string;
    location?: string;
    startDate: string;
    endDate?: string | null;
    isPresent: boolean;
    description?: string;
  }) => api.post("/work-experience", data),

  update: (
    id: string,
    data: {
      companyName: string;
      position: string;
      location?: string;
      startDate: string;
      endDate?: string | null;
      isPresent: boolean;
      description?: string;
    },
  ) => api.patch(`/work-experience/${id}`, data),

  delete: (id: string) => api.delete(`/work-experience/${id}`),
};
