"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Plus } from "lucide-react";
import SkillsTable from "./TabelSkills";
import DeleteSkillModal from "./DeleteSkillModal";

interface SkillItem {
  id: string;
  name: string;
  level: "JUNIOR" | "INTERMEDIATE" | "SENIOR" | "EXPERT";
  createdAt: string;
}

interface SkillsCardProps {
  data: SkillItem[];
  onDelete: (id: string) => Promise<void>;
  onRequestCreate: () => void;
  onRequestEdit: (item: SkillItem) => void;
}

export default function SkillsCard({
  data,
  onDelete,
  onRequestCreate,
  onRequestEdit,
}: SkillsCardProps) {
  const [deleteItem, setDeleteItem] = useState<{
    id: string;
    name: string;
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
        <CardContent className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                <Brain className="h-5 w-5 text-emerald-500" />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900">Skills</h2>
                <p className="text-xs text-gray-400">
                  Manage your professional skills
                </p>
              </div>
            </div>

            <Button
              size="sm"
              onClick={onRequestCreate}
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>

          {/* Content */}
          {data.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-emerald-400" />
              </div>

              <p className="text-sm text-gray-500 mb-4">No skills added yet.</p>

              <Button
                size="sm"
                onClick={onRequestCreate}
                className="bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Skill
              </Button>
            </div>
          ) : (
            <div className="w-full overflow-hidden rounded-xl border border-gray-100">
              <SkillsTable
                data={data}
                onEdit={(item) => {
                  onRequestEdit(item);
                }}
                onDelete={(id) => {
                  const item = data.find((item) => item.id === id);
                  if (item) {
                    setDeleteItem({
                      id,
                      name: item.name,
                    });
                  }
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <DeleteSkillModal
        isOpen={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={handleDelete}
        title={`Delete ${deleteItem?.name || "Skill"}`}
        description="Remove this skill from your profile?"
        isLoading={isDeleting}
      />
    </>
  );
}
