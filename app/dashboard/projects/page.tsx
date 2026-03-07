"use client";

import { useEffect, useState, useMemo } from "react";
import Loading from "@/components/custom-ui/Loading";
import { toast } from "sonner";

import ProjectSection from "@/components/custom-ui/project/ProjectSection";
import CreateProjectModal from "@/components/custom-ui/project/CreateProjectModal";
import EditProjectModal from "@/components/custom-ui/project/EditProjectModal";
import DeleteProjectModal from "@/components/custom-ui/project/DeleteProjectModal";

import { projectApi } from "@/modules/project/project.api";
import { useProjectForm } from "@/modules/project/useProjectForm";
import { mapZodErrors } from "@/shared/utils/mapZodErrors";
import { skillApi } from "@/modules/skills/skill-api";
import ErrorState from "@/components/dashboard/ErrorState";

interface Skill {
  id: string;
  name: string;
  photo: string;
}

interface SkillOption {
  value: string;
  label: string;
}

interface ProjectItem {
  id: string;
  title: string;
  link?: string | null;
  description?: string | null;
  projectImage?: string | null;
  skills: Skill[];
  createdAt: string;
}

export default function ProjectPage() {
  const [data, setData] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEditModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState<ProjectItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingItem, setEditingItem] = useState<ProjectItem | null>(null);

  const memoEditingItem = useMemo(() => editingItem, [editingItem?.id]);

  const projectCreateForm = useProjectForm();
  const projectEditForm = useProjectForm(memoEditingItem ?? undefined);

  const [skillOptions, setSkillOptions] = useState<SkillOption[]>([]);

  useEffect(() => {
    loadSkills();
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(false);

      const res = await projectApi.get();
      const items = res.data?.data?.items ?? [];
      setData(items);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const loadSkills = async () => {
    try {
      const res = await skillApi.getOptions();
      setSkillOptions(res.data.data ?? []);
    } catch (err) {
      console.error("Failed to load skills", err);
    }
  };

  const buildFormData = (values: any) => {
    const formData = new FormData();

    formData.append("title", values.title);
    formData.append("description", values.description || "");
    formData.append("link", values.link || "");

    if (values.projectImage) {
      formData.append("projectImage", values.projectImage);
    }

    values.skillIds.forEach((id: string) => {
      formData.append("skillIds", id);
    });

    return formData;
  };

  const handleCreate = async () => {
    projectCreateForm.setLoading(true);
    projectCreateForm.setErrors({});

    try {
      const formData = buildFormData(projectCreateForm.values);
      const res = await projectApi.create(formData);

      setData((prev) => [...prev, res.data.data]);
      setShowCreate(false);
      projectCreateForm.reset();

      toast.success("Project added");
    } catch (err: any) {
      const errorData = err?.response?.data;

      if (errorData?.error?.fields) {
        projectCreateForm.setErrors(mapZodErrors(errorData.error.fields));
        return;
      }

      toast.error(errorData?.error?.message || "Failed to create");
    } finally {
      projectCreateForm.setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingItem) return;

    projectEditForm.setLoading(true);
    projectEditForm.setErrors({});

    try {
      const formData = buildFormData(projectEditForm.values);
      const res = await projectApi.update(editingItem.id, formData);

      setData((prev) =>
        prev.map((item) => (item.id === editingItem.id ? res.data.data : item)),
      );

      setShowEditModal(false);
      setEditingItem(null);
      projectEditForm.reset();

      toast.success("Updated successfully");
    } catch (err: any) {
      const errorData = err?.response?.data;

      if (errorData?.error?.fields) {
        projectEditForm.setErrors(mapZodErrors(errorData.error.fields));
        return;
      }

      toast.error(errorData?.error?.message || "Failed to update");
    } finally {
      projectEditForm.setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteItem) return;

    setIsDeleting(true);

    try {
      await projectApi.delete(deleteItem.id);
      setData((prev) => prev.filter((item) => item.id !== deleteItem.id));

      toast.success("Project deleted");
      setDeleteItem(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.error?.message || "Failed to delete");
    } finally {
      setIsDeleting(false);
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
        <ProjectSection
          data={data}
          onDelete={(id) => {
            const item = data.find((d) => d.id === id);
            if (item) setDeleteItem(item);
          }}
          onRequestCreate={() => setShowCreate(true)}
          onRequestEdit={(item) => {
            setEditingItem({
              ...item,
              skillIds: item.skills.map((s: Skill) => s.id),
            } as any);
            setShowEditModal(true);
          }}
        />
      </div>

      <CreateProjectModal
        open={showCreate}
        onClose={() => {
          projectCreateForm.reset();
          setShowCreate(false);
        }}
        values={projectCreateForm.values}
        setValues={projectCreateForm.setValues}
        onSubmit={handleCreate}
        skillOptions={skillOptions}
        fileRef={projectCreateForm.fileRef}
        isLoading={projectCreateForm.loading}
        errors={projectCreateForm.errors}
      />

      <EditProjectModal
        open={showEdit}
        onClose={() => {
          projectEditForm.reset();
          setShowEditModal(false);
          setEditingItem(null);
        }}
        values={projectEditForm.values}
        setValues={projectEditForm.setValues}
        onSubmit={handleUpdate}
        skillOptions={skillOptions}
        fileRef={projectEditForm.fileRef}
        isLoading={projectEditForm.loading}
        errors={projectEditForm.errors}
      />

      <DeleteProjectModal
        open={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={handleDelete}
        projectTitle={deleteItem?.title}
        isLoading={isDeleting}
      />
    </div>
  );
}
