"use client";

import { useEffect, useState } from "react";
import Loading from "@/components/custom-ui/Loading";
import { toast } from "sonner";
import SkillsCard from "@/components/custom-ui/skills/SkillsCard";
import CreateSkillModal from "@/components/custom-ui/skills/CreateSkillModal";
import EditSkillModal from "@/components/custom-ui/skills/EditSkillModal";
import { skillApi } from "@/modules/skills/skill-api";
import { useSkillForm } from "@/modules/skills/useSkillForm";
import ErrorState from "@/components/dashboard/ErrorState";

interface SkillItem {
  id: string;
  name: string;
  photo?: string;
  level: "JUNIOR" | "INTERMEDIATE" | "SENIOR" | "EXPERT";
  createdAt: string;
}

export default function SkillPage() {
  const [skillsData, setSkillsData] = useState<SkillItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [editingSkill, setEditingSkill] = useState<SkillItem | null>(null);

  const skillCreateForm = useSkillForm();
  const skillEditForm = useSkillForm(editingSkill ?? undefined);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(false);

      const res = await skillApi.get();
      setSkillsData(res.data.data?.items ?? []);
    } catch (err) {
      // 401 handled by interceptor
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // CREATE
  const handleCreateSkill = async () => {
    skillCreateForm.setLoading(true);
    skillCreateForm.setErrors({});

    try {
      const formData = new FormData();
      formData.append("name", skillCreateForm.values.name);

      // ✅ kirim level enum
      formData.append("level", skillCreateForm.values.level);

      // ✅ kirim icon
      if (skillCreateForm.values.photo) {
        formData.append("photo", skillCreateForm.values.photo);
      }

      const res = await skillApi.create(formData);

      setSkillsData((prev) => [...prev, res.data.data]);
      setShowCreateModal(false);
      skillCreateForm.reset();

      toast.success("Skill added successfully");
    } catch (err: any) {
      const errorData = err?.response?.data;

      if (errorData?.error?.fields) {
        const formatted: Record<string, string> = {};
        Object.keys(errorData.error.fields).forEach((key) => {
          formatted[key] = errorData.error.fields[key][0];
        });

        skillCreateForm.setErrors(formatted);
        return;
      }

      toast.error(errorData?.error?.message || "Failed to create skill");
    } finally {
      skillCreateForm.setLoading(false);
    }
  };

  // UPDATE
  const handleUpdateSkill = async () => {
    if (!editingSkill) return;

    skillEditForm.setLoading(true);
    skillEditForm.setErrors({});

    try {
      const formData = new FormData();
      formData.append("name", skillEditForm.values.name);

      // ✅ kirim level enum
      formData.append("level", skillEditForm.values.level);

      // ✅ kirim photo kalau ada
      if (skillEditForm.values.photo) {
        formData.append("photo", skillEditForm.values.photo);
      }

      const res = await skillApi.update(editingSkill.id, formData);

      setSkillsData((prev) =>
        prev.map((item) =>
          item.id === editingSkill.id ? res.data.data : item,
        ),
      );

      setShowEditModal(false);
      setEditingSkill(null);
      skillEditForm.reset();

      toast.success("Skill updated successfully");
    } catch (err: any) {
      const errorData = err?.response?.data;

      if (errorData?.error?.fields) {
        const formatted: Record<string, string> = {};
        Object.keys(errorData.error.fields).forEach((key) => {
          formatted[key] = errorData.error.fields[key][0];
        });

        skillEditForm.setErrors(formatted);
        return;
      }

      toast.error(errorData?.error?.message || "Failed to update skill");
    } finally {
      skillEditForm.setLoading(false);
    }
  };

  // DELETE
  const handleDeleteSkill = async (id: string) => {
    try {
      await skillApi.delete(id);

      setSkillsData((prev) => prev.filter((item) => item.id !== id));

      toast.success("Skill deleted successfully");
    } catch (err: any) {
      const errorData = err?.response?.data;

      toast.error(errorData?.error?.message || "Failed to delete skill");
    }
  };

  if (loading) return <Loading />;
  if (error)
    return (
      <ErrorState
        title="Failed to load projects"
        message="There was a problem fetching project data."
        onRetry={loadData}
      />
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-8 py-10 space-y-10">
        <SkillsCard
          data={skillsData}
          onDelete={handleDeleteSkill}
          onRequestCreate={() => setShowCreateModal(true)}
          onRequestEdit={(item) => {
            setEditingSkill(item);
            setShowEditModal(true);
          }}
        />
      </div>

      <CreateSkillModal
        open={showCreateModal}
        onClose={() => {
          skillCreateForm.reset();
          setShowCreateModal(false);
        }}
        values={skillCreateForm.values}
        setValues={skillCreateForm.setValues}
        fileRef={skillCreateForm.fileRef}
        onSubmit={handleCreateSkill}
        isLoading={skillCreateForm.loading}
        errors={skillCreateForm.errors}
      />

      <EditSkillModal
        open={showEditModal}
        onClose={() => {
          skillEditForm.reset();
          setShowEditModal(false);
          setEditingSkill(null);
        }}
        values={skillEditForm.values}
        setValues={skillEditForm.setValues}
        fileRef={skillEditForm.fileRef}
        onSubmit={handleUpdateSkill}
        isLoading={skillEditForm.loading}
        errors={skillEditForm.errors}
      />
    </div>
  );
}
