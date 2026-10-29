
"use client";

import { useEffect, useState } from "react";
import { contactApi } from "@/modules/contact/contact.api";
import { Contact } from "@/modules/contact/contact.types";
import Loading from "@/components/custom-ui/Loading";
import ContactCard from "@/components/custom-ui/contact/ContactCard";
import { toast } from "sonner";
import { useContactForm } from "@/modules/contact/useContactForm";
import EditContactModal from "@/components/custom-ui/contact/EditContactModal";
import CreateContactModal from "@/components/custom-ui/contact/CreateContactModal";
import DeleteContactModal from "@/components/custom-ui/contact/DeleteContactModal";
import ErrorState from "@/components/dashboard/ErrorState";

export default function ContactPage() {
  const [contactData, setContactData] = useState<Contact | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const contactForm = useContactForm(contactData ?? undefined);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(false);

      const res = await contactApi.get();
      setContactData(res.data.data ?? null);
    } catch (err: any) {
      const status = err?.response?.status;

      if (status === 404) {
        setContactData(null);
        return;
      }

      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateContact = async () => {
    contactForm.setLoading(true);
    contactForm.setErrors({});

    try {
      const values = contactForm.values;

      const payload = {
        email: values.email.trim() || null,
        phone: values.phone.trim() || null,
        whatsapp: values.whatsapp.trim() || null,
        address: values.address.trim() || null,
        isAvailable: values.isAvailable,
        showEmail: values.showEmail,
        showPhone: values.showPhone,
        showWhatsapp: values.showWhatsapp,
        showAddress: values.showAddress,
        showAvailability: values.showAvailability,
      };

      const res = await contactApi.create(payload);

      setContactData(res.data.data);

      setShowCreateModal(false);
      contactForm.reset();

      toast.success("Contact created successfully");
    } catch (err: any) {
      const errorData = err?.response?.data;

      if (errorData?.error?.fields) {
        const formatted: Record<string, string> = {};

        Object.keys(errorData.error.fields).forEach((key) => {
          formatted[key] = errorData.error.fields[key][0];
        });

        contactForm.setErrors(formatted);
        return;
      }

      toast.error(
        errorData?.error?.message || "Failed to create contact",
      );
    } finally {
      contactForm.setLoading(false);
    }
  };

  const handleUpdateContact = async () => {
    if (!contactData) return;

    contactForm.setLoading(true);
    contactForm.setErrors({});

    try {
      const values = contactForm.values;

      const payload = {
        email: values.email.trim() || null,
        phone: values.phone.trim() || null,
        whatsapp: values.whatsapp.trim() || null,
        address: values.address.trim() || null,
        isAvailable: values.isAvailable,
        showEmail: values.showEmail,
        showPhone: values.showPhone,
        showWhatsapp: values.showWhatsapp,
        showAddress: values.showAddress,
        showAvailability: values.showAvailability,
      };

      const isChanged = Object.entries(payload).some(
        ([key, value]) =>
          contactData[key as keyof Contact] !== value,
      );

      if (!isChanged) {
        toast.info("No changes detected");
        return;
      }

      const res = await contactApi.update(payload);

      setContactData(res.data.data);

      setShowEditModal(false);
      contactForm.reset();

      toast.success("Contact updated successfully");
    } catch (err: any) {
      const errorData = err?.response?.data;

      if (errorData?.error?.fields) {
        const formatted: Record<string, string> = {};

        Object.keys(errorData.error.fields).forEach((key) => {
          formatted[key] = errorData.error.fields[key][0];
        });

        contactForm.setErrors(formatted);
        return;
      }

      if (errorData?.error?.code === "NO_CHANGES") {
        toast.info("No changes detected");
        return;
      }

      toast.error(
        errorData?.error?.message || "Failed to update contact",
      );
    } finally {
      contactForm.setLoading(false);
    }
  };

  const handleDeleteContact = async () => {
    if (!contactData) return;

    setIsDeleting(true);

    try {
      await contactApi.delete();

      setContactData(null);
      contactForm.reset();

      setShowDeleteModal(false);

      toast.success("Contact deleted successfully");
    } catch (err: any) {
      const errorData = err?.response?.data;

      toast.error(
        errorData?.error?.message || "Failed to delete contact",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) return <Loading />;

  if (error) {
    return (
      <ErrorState
        title="Failed to load contact"
        message="There was a problem fetching contact data."
        onRetry={loadData}
      />
    );
  }

  return (
    <div className="min-h-screen space-y-8 bg-gray-50 p-10">
      <ContactCard
        data={contactData}
        onRequestCreate={() => {
          contactForm.reset();
          setShowCreateModal(true);
        }}
        onRequestEdit={() => {
          contactForm.reset();
          setShowEditModal(true);
        }}
        onRequestDelete={() => setShowDeleteModal(true)}
      />

      <CreateContactModal
        open={showCreateModal}
        onClose={() => {
          contactForm.reset();
          setShowCreateModal(false);
        }}
        values={contactForm.values}
        setValues={contactForm.setValues}
        onSubmit={handleCreateContact}
        isLoading={contactForm.loading}
        errors={contactForm.errors}
      />

      <EditContactModal
        open={showEditModal}
        onClose={() => {
          contactForm.reset();
          setShowEditModal(false);
        }}
        values={contactForm.values}
        setValues={contactForm.setValues}
        onSubmit={handleUpdateContact}
        isLoading={contactForm.loading}
        errors={contactForm.errors}
      />

      <DeleteContactModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteContact}
        isLoading={isDeleting}
      />
    </div>
  );
}
