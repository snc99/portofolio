"use client";

import { useEffect, useState } from "react";
import { aboutApi } from "@/modules/about/about.api";
import Loading from "@/components/custom-ui/Loading";
import AboutCard from "@/components/custom-ui/about/AboutCard";
import { toast } from "sonner";
import { useAboutForm } from "@/modules/about/useAboutForm";
import EditAboutModal from "@/components/custom-ui/about/EditAboutModal";
import CreateAboutModal from "@/components/custom-ui/about/CreateAboutModal";
import DeleteAboutModal from "@/components/custom-ui/about/DeleteAboutModal";

export default function AboutPage() {
  const [aboutData, setAboutData] = useState<{
    id: string;
    description: string;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const aboutForm = useAboutForm(aboutData ?? undefined);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(false);

      const res = await aboutApi.get();
      setAboutData(res.data.data ?? null);
    } catch (err: any) {
      const status = err?.response?.status;

      if (status === 404) {
        setAboutData(null);
        return;
      }

      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAbout = async () => {
    aboutForm.setLoading(true);
    aboutForm.setErrors({});

    try {
      const formData = new FormData();
      formData.append("description", aboutForm.values.description);

      // ✅ kirim foto jika ada
      if (aboutForm.values.photoFile) {
        formData.append("photo", aboutForm.values.photoFile);
      }

      const res = await aboutApi.create(formData);

      setAboutData(res.data.data);

      setShowCreateModal(false);
      aboutForm.reset();

      toast.success("About created successfully");
    } catch (err: any) {
      const errorData = err?.response?.data;

      if (errorData?.error?.fields) {
        const formatted: Record<string, string> = {};
        Object.keys(errorData.error.fields).forEach((key) => {
          formatted[key] = errorData.error.fields[key][0];
        });

        aboutForm.setErrors(formatted);
        return;
      }

      toast.error(errorData?.error?.message || "Failed to create about");
    } finally {
      aboutForm.setLoading(false);
    }
  };

  const handleUpdateAbout = async () => {
    if (!aboutData) return;

    aboutForm.setLoading(true);
    aboutForm.setErrors({});

    try {
      // 🔥 Detect changes
      const isDescriptionChanged =
        aboutForm.values.description.trim() !== aboutData.description.trim();

      const isPhotoChanged = !!aboutForm.values.photoFile;

      if (!isDescriptionChanged && !isPhotoChanged) {
        toast.info("No changes detected");
        return;
      }

      // 🔥 Build form data
      const formData = new FormData();
      formData.append("description", aboutForm.values.description.trim());

      if (aboutForm.values.photoFile) {
        formData.append("photo", aboutForm.values.photoFile);
      }

      const res = await aboutApi.update(formData);

      // ✅ Sync UI with server response
      setAboutData(res.data.data);

      setShowEditModal(false);
      aboutForm.reset();

      toast.success("About updated successfully");
    } catch (err: any) {
      const errorData = err?.response?.data;

      // 🔴 Validation errors
      if (errorData?.error?.fields) {
        const formatted: Record<string, string> = {};

        Object.keys(errorData.error.fields).forEach((key) => {
          formatted[key] = errorData.error.fields[key][0];
        });

        aboutForm.setErrors(formatted);
        return;
      }

      // 🔴 Backend no changes fallback
      if (errorData?.error?.code === "NO_CHANGES") {
        toast.info("No changes detected");
        return;
      }

      toast.error(errorData?.error?.message || "Failed to update about");
    } finally {
      aboutForm.setLoading(false);
    }
  };

  const handleDeleteAbout = async () => {
    if (!aboutData) return;

    setIsDeleting(true);

    try {
      await aboutApi.delete();

      setAboutData(null);
      aboutForm.reset(); // 🔥 INI YANG KURANG

      setShowDeleteModal(false);

      toast.success("About deleted successfully");
    } catch (err: any) {
      const errorData = err?.response?.data;

      toast.error(errorData?.error?.message || "Failed to delete about");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) return <Loading />;
  if (error)
    return (
      <div className="text-center text-red-500">Failed to load about data.</div>
    );
  return (
    <div className="min-h-screen bg-gray-50 p-10 space-y-8">
      <AboutCard
        data={aboutData}
        onRequestCreate={() => setShowCreateModal(true)}
        onRequestEdit={() => setShowEditModal(true)}
        onRequestDelete={() => setShowDeleteModal(true)}
      />

      <CreateAboutModal
        open={showCreateModal}
        onClose={() => {
          aboutForm.reset();
          setShowCreateModal(false);
        }}
        values={aboutForm.values}
        setValues={aboutForm.setValues}
        onSubmit={handleCreateAbout}
        isLoading={aboutForm.loading}
        errors={aboutForm.errors}
      />

      <EditAboutModal
        open={showEditModal}
        onClose={() => {
          aboutForm.reset();
          setShowEditModal(false);
        }}
        values={aboutForm.values}
        setValues={aboutForm.setValues}
        onSubmit={handleUpdateAbout}
        isLoading={aboutForm.loading}
        errors={aboutForm.errors}
      />

      <DeleteAboutModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAbout}
        isLoading={isDeleting}
      />
    </div>
  );
}
