"use client";

import { useEffect, useState } from "react";
import Loading from "@/components/custom-ui/Loading";
import { toast } from "sonner";
import WorkExperienceCard from "@/components/custom-ui/work-experience/WorkExperienceCard";
import CreateWorkExperienceModal from "@/components/custom-ui/work-experience/CreateWorkExperienceModal";
import EditWorkExperienceModal from "@/components/custom-ui/work-experience/EditWorkExperienceModal";
import DeleteWorkExperienceModal from "@/components/custom-ui/work-experience/DeleteWorkExperienceModal";
import { workExperienceApi } from "@/modules/work-experience/workExperience.api";
import { useWorkExperienceForm } from "@/modules/work-experience/useWorkExperienceForm";
import { mapZodErrors } from "@/shared/utils/mapZodErrors";
import ErrorState from "@/components/dashboard/ErrorState";

interface WorkItem {
  id: string;
  companyName: string;
  position: string;
  location?: string;
  startDate: string;
  endDate?: string | null;
  isPresent: boolean;
  description?: string;
  createdAt: string;
}

export default function WorkExperiencePage() {
  const [data, setData] = useState<WorkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEditModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState<WorkItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [editingItem, setEditingItem] = useState<WorkItem | null>(null);

  const workCreateForm = useWorkExperienceForm();
  const workEditForm = useWorkExperienceForm(editingItem ?? undefined);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(false);

      const res = await workExperienceApi.get();
      setData(res.data.data?.items ?? []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    workCreateForm.setLoading(true);
    workCreateForm.setErrors({});

    try {
      const payload = {
        ...workCreateForm.values,
        location: workCreateForm.values.location.trim() || undefined,
        endDate: workCreateForm.values.isPresent
          ? null
          : workCreateForm.values.endDate || null,
        description: workCreateForm.values.description?.trim() || undefined,
      };

      const res = await workExperienceApi.create(payload);

      setData((prev) => [...prev, res.data.data]);
      setShowCreate(false);
      workCreateForm.reset();

      toast.success("Work experience added");
    } catch (err: any) {
      const errorData = err?.response?.data;

      if (errorData?.error?.fields) {
        workCreateForm.setErrors(mapZodErrors(errorData.error.fields));
        return;
      }

      toast.error(errorData?.error?.message || "Failed to create");
    } finally {
      workCreateForm.setLoading(false);
    }
  };
  const handleUpdate = async () => {
    if (!editingItem) return;

    workEditForm.setLoading(true);
    workEditForm.setErrors({});

    try {
      const payload = {
        ...workEditForm.values,
        location: workEditForm.values.location.trim() || undefined,
        description: workEditForm.values.description?.trim() || undefined,
        endDate: workEditForm.values.isPresent
          ? null
          : workEditForm.values.endDate || null,
      };

      const res = await workExperienceApi.update(editingItem.id, payload);

      setData((prev) =>
        prev.map((item) => (item.id === editingItem.id ? res.data.data : item)),
      );

      setShowEditModal(false);
      setEditingItem(null);
      workEditForm.reset();

      toast.success("Updated successfully");
    } catch (err: any) {
      const errorData = err?.response?.data;

      if (errorData?.error?.fields) {
        workEditForm.setErrors(mapZodErrors(errorData.error.fields));
        return;
      }

      toast.error(errorData?.error?.message || "Failed to update");
    } finally {
      workEditForm.setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteItem) return;

    setIsDeleting(true);

    try {
      await workExperienceApi.delete(deleteItem.id);

      setData((prev) => prev.filter((item) => item.id !== deleteItem.id));

      toast.success("Work experience deleted");

      setDeleteItem(null);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.error?.message || "Failed to delete";

      toast.error(errorMessage);
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
        <WorkExperienceCard
          data={data}
          onDelete={(id) => {
            const item = data.find((d) => d.id === id);
            if (item) setDeleteItem(item);
          }}
          onRequestCreate={() => setShowCreate(true)}
          onRequestEdit={(item) => {
            setEditingItem(item);
            setShowEditModal(true);
          }}
        />
      </div>

      <CreateWorkExperienceModal
        open={showCreate}
        onClose={() => {
          workCreateForm.reset();
          setShowCreate(false);
        }}
        values={workCreateForm.values}
        setValues={workCreateForm.setValues}
        onSubmit={handleCreate}
        isLoading={workCreateForm.loading}
        errors={workCreateForm.errors}
      />

      <EditWorkExperienceModal
        open={showEdit}
        onClose={() => {
          workEditForm.reset();
          setShowEditModal(false);
          setEditingItem(null);
        }}
        values={workEditForm.values}
        setValues={workEditForm.setValues}
        onSubmit={handleUpdate}
        isLoading={workEditForm.loading}
        errors={workEditForm.errors}
      />

      <DeleteWorkExperienceModal
        open={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={handleDelete}
        companyName={deleteItem?.companyName}
        isLoading={isDeleting}
      />
    </div>
  );
}
