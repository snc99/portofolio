import ProjectItemCard from "./ProjectItemCard";

interface Props {
  data: any[];
  onDelete: (id: string) => void;
  onEdit: (item: any) => void;
}

export default function ProjectList({ data, onDelete, onEdit }: Props) {
  if (!data.length) {
    return (
      <div className="text-sm text-gray-400 text-center py-10 border border-dashed rounded-xl">
        No projects added yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {data.map((item) => (
        <ProjectItemCard
          key={item.id}
          item={item}
          onDelete={() => onDelete(item.id)}
          onEdit={() => onEdit(item)}
        />
      ))}
    </div>
  );
}
