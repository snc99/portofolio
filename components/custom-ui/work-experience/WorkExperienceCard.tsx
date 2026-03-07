"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Plus } from "lucide-react";
import WorkExperienceTable from "./WorkExperienceTable";

interface Props {
  data: any[];
  onDelete: (id: string) => void;
  onRequestCreate: () => void;
  onRequestEdit: (item: any) => void;
}

export default function WorkExperienceCard({
  data,
  onDelete,
  onRequestCreate,
  onRequestEdit,
}: Props) {
  return (
    <Card className="w-full rounded-2xl border border-gray-100 shadow-sm">
      <CardContent className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-emerald-500" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Work Experience
              </h2>
              <p className="text-xs text-gray-400">
                Manage your professional experience
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

        <WorkExperienceTable
          data={data}
          onDelete={onDelete}
          onEdit={onRequestEdit}
        />
      </CardContent>
    </Card>
  );
}
