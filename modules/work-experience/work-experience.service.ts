// work-experience.service.ts
import { workExperienceRepository } from "./work-experience.repository";

export const workExperienceService = {
  async update(id: string, data: any) {
    try {
      return await workExperienceRepository.update(id, data);
    } catch {
      throw new Error("Failed to update work experience");
    }
  },

  async delete(id: string) {
    try {
      await workExperienceRepository.delete(id);
    } catch {
      throw new Error("Failed to delete work experience");
    }
  },
};
