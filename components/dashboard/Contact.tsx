
"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Contact as ContactIcon,
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  BriefcaseBusiness,
  Eye,
  EyeOff,
} from "lucide-react";

type ContactData = {
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  address: string | null;
  isAvailable: boolean;
  showEmail: boolean;
  showPhone: boolean;
  showWhatsapp: boolean;
  showAddress: boolean;
  showAvailability: boolean;
};

const Contact = () => {
  const [contact, setContact] = useState<ContactData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await fetch("/api/contact");

        if (!res.ok) {
          if (res.status === 404) {
            setContact(null);
            return;
          }

          throw new Error("Failed to retrieve contact data");
        }

        const result = await res.json();

        // Support both raw data and ApiResponse format.
        setContact(result.data ?? result);
      } catch {
        setError("An error occurred while retrieving contact data.");
      } finally {
        setLoading(false);
      }
    };

    fetchContact();
  }, []);

  const items = contact
    ? [
        {
          label: "Email",
          value: contact.email,
          visible: contact.showEmail,
          icon: Mail,
        },
        {
          label: "Phone",
          value: contact.phone,
          visible: contact.showPhone,
          icon: Phone,
        },
        {
          label: "WhatsApp",
          value: contact.whatsapp,
          visible: contact.showWhatsapp,
          icon: MessageCircle,
        },
        {
          label: "Address",
          value: contact.address,
          visible: contact.showAddress,
          icon: MapPin,
        },
        {
          label: "Availability",
          value: contact.isAvailable ? "Open to Work" : "Not Available",
          visible: contact.showAvailability,
          icon: BriefcaseBusiness,
        },
      ]
    : [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <ContactIcon className="text-purple-600" />
        <CardTitle>Contact</CardTitle>
      </CardHeader>

      <CardContent>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : !contact ? (
          <p className="text-gray-400">No contact data available yet.</p>
        ) : (
          <div className="space-y-4">
            {items.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="flex items-start justify-between gap-4"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <Icon className="mt-0.5 h-5 w-5 shrink-0 text-gray-500" />

                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-700">
                        {item.label}
                      </p>
                      <p className="break-words text-sm text-gray-500">
                        {item.value || "Not provided"}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`flex shrink-0 items-center gap-1 text-xs ${
                      item.visible ? "text-green-600" : "text-gray-400"
                    }`}
                  >
                    {item.visible ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                    <span>{item.visible ? "Public" : "Hidden"}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Contact;
