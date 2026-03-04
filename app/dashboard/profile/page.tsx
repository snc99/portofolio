"use client";

import { useEffect, useState } from "react";
import Loading from "@/components/custom-ui/Loading";
import ErrorServer from "@/components/card/errorServer";
import PersonalInfoCard from "@/components/custom-ui/profile/personal-info/PersonalInfoCard";
import DeleteModal from "@/components/custom-ui/profile/personal-info/DeletePersonalinfoModal";
import EditPersonalModal from "@/components/custom-ui/profile/personal-info/EditPersonalinfoModal";
import SocialMediaCard from "@/components/custom-ui/profile/social-media/SocialMediaCard";
import { toast } from "sonner";
import CreatePersonalInfoModal from "@/components/custom-ui/profile/personal-info/CreatePersonalInfoModal";
import { PersonalInfo } from "@/modules/profile/profile.types";
import CreateSocialMediaModal from "@/components/custom-ui/profile/social-media/CreateSocialMediaModal";
import EditSocialMediaModal from "@/components/custom-ui/profile/social-media/EditSocialMediaModal";
import { useProfileForm } from "@/modules/profile/useProfileForm";
import { useSocialMediaForm } from "@/modules/social-media/useSocialMediaForm";
import { profileApi } from "@/modules/profile/profile.api";
import { socialMediaApi } from "@/modules/social-media/social-media.api";

interface SocialMediaItem {
  id: string;
  platform: string;
  url: string;
  photo: string;
}

export default function ProfilePage() {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [socialMediaData, setSocialMediaData] = useState<SocialMediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCreateSocialModal, setShowCreateSocialModal] = useState(false);
  const [showEditSocialModal, setShowEditSocialModal] = useState(false);

  const [editingSocial, setEditingSocial] = useState<{
    id: string;
    platform: string;
    url: string;
  } | null>(null);

  const socialCreateForm = useSocialMediaForm();
  const socialEditForm = useSocialMediaForm(editingSocial ?? undefined);

  const profileForm = useProfileForm(personalInfo || undefined);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(false);

      const [personalRes, socialRes] = await Promise.all([
        profileApi.get(),
        socialMediaApi.get(),
      ]);

      setPersonalInfo(personalRes.data.data ?? null);
      setSocialMediaData(socialRes.data.data?.items ?? []);
    } catch (err: any) {
      // 401 sudah ditangani interceptor (auto redirect)
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePersonal = async (formData: FormData) => {
    profileForm.setLoading(true);
    profileForm.setErrors({});

    try {
      const res = await profileApi.create(formData);

      setPersonalInfo(res.data.data);
      setOpen(false);
      profileForm.resetForCreate();

      toast.success("Personal information created successfully");
    } catch (err: any) {
      const errorData = err?.response?.data;

      if (errorData?.error?.fields) {
        const formatted: Record<string, string> = {};

        Object.keys(errorData.error.fields).forEach((key) => {
          formatted[key] = errorData.error.fields[key][0];
        });

        profileForm.setErrors(formatted);
        return;
      }

      toast.error(errorData?.error?.message || "Server error occurred");
    } finally {
      profileForm.setLoading(false);
    }
  };

  const handleUpdatePersonal = async () => {
    profileForm.setLoading(true);
    profileForm.setErrors({});

    try {
      const formData = new FormData();
      formData.append("motto", profileForm.values.motto);

      if (profileForm.values.cv) {
        formData.append("cv", profileForm.values.cv);
      }

      const res = await profileApi.update(formData);

      setPersonalInfo(res.data.data);
      setShowEditModal(false);
      profileForm.resetToInitial();

      toast.success("Personal information updated successfully");
    } catch (err: any) {
      const errorData = err?.response?.data;

      // 🔥 Validation error
      if (errorData?.error?.fields) {
        const formatted: Record<string, string> = {};

        Object.keys(errorData.error.fields).forEach((key) => {
          formatted[key] = errorData.error.fields[key][0];
        });

        profileForm.setErrors(formatted);
        return;
      }

      // 🔥 No changes detected
      if (errorData?.error?.code === "NO_CHANGES") {
        toast.info("No changes detected");
        return;
      }

      toast.error(errorData?.error?.message || "Server error occurred");
    } finally {
      profileForm.setLoading(false);
    }
  };

  const handleDeletePersonal = async () => {
    if (!personalInfo?.id) return;

    setIsDeleting(true);

    try {
      await profileApi.delete();

      setPersonalInfo(null);
      setShowDeleteModal(false);

      toast.success("Personal information deleted");
    } catch (err: any) {
      const errorData = err?.response?.data;

      toast.error(
        errorData?.error?.message || "Failed to delete personal information",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCreateSocial = async () => {
    socialCreateForm.setLoading(true);
    socialCreateForm.setErrors({});

    try {
      const formData = new FormData();
      formData.append("platform", socialCreateForm.values.platform);
      formData.append("url", socialCreateForm.values.url);

      if (socialCreateForm.values.photo) {
        formData.append("photo", socialCreateForm.values.photo);
      }

      const res = await socialMediaApi.create(formData);

      setSocialMediaData((prev) => [...prev, res.data.data]);

      setShowCreateSocialModal(false);
      socialCreateForm.reset();

      toast.success("Social media added successfully");
    } catch (err: any) {
      const errorData = err?.response?.data;

      if (errorData?.error?.fields) {
        const formatted: Record<string, string> = {};
        Object.keys(errorData.error.fields).forEach((key) => {
          formatted[key] = errorData.error.fields[key][0];
        });

        socialCreateForm.setErrors(formatted);
        return;
      }

      toast.error(errorData?.error?.message || "Failed to create social media");
    } finally {
      socialCreateForm.setLoading(false);
    }
  };

  const handleUpdateSocial = async () => {
    if (!editingSocial) return;

    socialEditForm.setLoading(true);
    socialEditForm.setErrors({});

    try {
      const formData = new FormData();
      formData.append("platform", socialEditForm.values.platform);
      formData.append("url", socialEditForm.values.url);

      if (socialEditForm.values.photo) {
        formData.append("photo", socialEditForm.values.photo);
      }

      const res = await socialMediaApi.update(editingSocial.id, formData);

      // ✅ Update state
      setSocialMediaData((prev) =>
        prev.map((item) =>
          item.id === editingSocial.id ? res.data.data : item,
        ),
      );

      setShowEditSocialModal(false);
      setEditingSocial(null);
      socialEditForm.reset();

      toast.success("Social media updated successfully");
    } catch (err: any) {
      const errorData = err?.response?.data;

      if (errorData?.error?.fields) {
        const formatted: Record<string, string> = {};
        Object.keys(errorData.error.fields).forEach((key) => {
          formatted[key] = errorData.error.fields[key][0];
        });

        socialEditForm.setErrors(formatted);
        return;
      }

      if (errorData?.error?.code === "DUPLICATE_PLATFORM") {
        socialEditForm.setErrors({
          platform: errorData.error.message,
        });
        return;
      }

      toast.error(errorData?.error?.message || "Failed to update social media");
    } finally {
      socialEditForm.setLoading(false);
    }
  };

  const handleDeleteSocial = async (id: string) => {
    try {
      await socialMediaApi.delete(id);

      setSocialMediaData((prev) => prev.filter((item) => item.id !== id));

      toast.success("Social media deleted successfully");
    } catch (err: any) {
      const errorData = err?.response?.data;

      toast.error(errorData?.error?.message || "Failed to delete social media");
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorServer />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-8 py-10 space-y-10">
        <PersonalInfoCard
          data={personalInfo}
          onRequestCreate={() => setOpen(true)}
          onRequestEdit={() => setShowEditModal(true)}
          onRequestDelete={() => setShowDeleteModal(true)}
        />

        <SocialMediaCard
          data={socialMediaData}
          onDelete={handleDeleteSocial}
          onRequestCreate={() => setShowCreateSocialModal(true)}
          onRequestEdit={(item) => {
            setEditingSocial(item);
            setShowEditSocialModal(true);
          }}
        />
      </div>
      <CreatePersonalInfoModal
        open={open}
        onClose={() => {
          profileForm.resetForCreate();
          setOpen(false);
        }}
        onSubmit={handleCreatePersonal}
        isLoading={profileForm.loading}
        errors={profileForm.errors}
      />
      <EditPersonalModal
        open={showEditModal}
        onClose={() => {
          profileForm.resetToInitial();
          setShowEditModal(false);
        }}
        values={profileForm.values}
        setValues={profileForm.setValues}
        onSubmit={handleUpdatePersonal}
        isLoading={profileForm.loading}
        errors={profileForm.errors}
      />
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeletePersonal}
        isLoading={isDeleting}
      />
      <CreateSocialMediaModal
        open={showCreateSocialModal}
        onClose={() => {
          socialCreateForm.reset();
          setShowCreateSocialModal(false);
        }}
        values={socialCreateForm.values}
        setValues={socialCreateForm.setValues}
        onSubmit={() => handleCreateSocial()}
        isLoading={socialCreateForm.loading}
        errors={socialCreateForm.errors}
      />
      <EditSocialMediaModal
        open={showEditSocialModal}
        onClose={() => {
          socialEditForm.reset();
          setShowEditSocialModal(false);
          setEditingSocial(null);
        }}
        values={socialEditForm.values}
        setValues={socialEditForm.setValues}
        onSubmit={handleUpdateSocial}
        isLoading={socialEditForm.loading}
        errors={socialEditForm.errors}
      />
    </div>
  );
}
