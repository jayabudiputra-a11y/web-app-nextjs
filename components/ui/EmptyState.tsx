"use client";

export default function EmptyState({
  title,
  description,
  icon,
}: {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="text-center py-12 flex flex-col items-center gap-4 text-gray-600">
      {icon}
      <h3 className="text-xl font-semibold">{title}</h3>
      <p>{description}</p>
    </div>
  );
}
