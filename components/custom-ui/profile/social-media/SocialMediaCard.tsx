"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, Plus } from "lucide-react";
import SocialMediaTable from "./TabelSocialMedia";
import DeleteSocialMediaModal from "./DeleteSocialMediaModal";

interface SocialMediaItem {
  id: string;
  platform: string;
  url: string;
  photo: string;
}

interface SocialMediaCardProps {
  data: SocialMediaItem[];
  onDelete: (id: string) => Promise<void>;
  onRequestCreate: () => void;
  onRequestEdit: (item: SocialMediaItem) => void;
}

export default function SocialMediaCard({
  data,
  onDelete,
  onRequestCreate,
  onRequestEdit,
}: SocialMediaCardProps) {
  const [deleteItem, setDeleteItem] = useState<{
    id: string;
    platform: string;
  } | null>(null);

  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteItem) return;

    setIsDeleting(true);
    try {
      await onDelete(deleteItem.id);
      setDeleteItem(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card className="w-full rounded-2xl border border-gray-100 shadow-sm">
        <CardContent className="p-4 md:p-6 lg:p-8">
          {/* Header */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6 md:mb-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                <Share2 className="h-5 w-5 text-emerald-500" />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Social Media
                </h2>
                <p className="text-xs text-gray-400">
                  Manage your social accounts
                </p>
              </div>
            </div>

            <Button
              size="sm"
              onClick={onRequestCreate}
              className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>

          {/* Content */}
          {data.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
                <Share2 className="h-6 w-6 text-emerald-400" />
              </div>

              <p className="text-sm text-gray-500 mb-4">
                No social media accounts added yet.
              </p>

              <Button
                size="sm"
                onClick={onRequestCreate}
                className="bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Account
              </Button>
            </div>
          ) : (
            <div className="w-full overflow-x-auto rounded-xl border border-gray-100">
              <SocialMediaTable
                data={data}
                onEdit={(item) => {
                  onRequestEdit(item);
                }}
                onDelete={(id) => {
                  const item = data.find((item) => item.id === id);
                  if (item) {
                    setDeleteItem({
                      id,
                      platform: item.platform,
                    });
                  }
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <DeleteSocialMediaModal
        isOpen={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={handleDelete}
        title={`Delete ${deleteItem?.platform || "Account"}`}
        description="Remove this social media account?"
        isLoading={isDeleting}
      />
    </>
  );
}
