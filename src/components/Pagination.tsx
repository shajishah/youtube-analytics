import { cn } from "@/lib/utils";

export default function Pagination({
  totalPages,
  currentPage,
  onPageChange,
}: {
  totalPages: number;
  currentPage: number;
  onPageChange: (p: number) => void;
}) {
  return (
    <div className="flex gap-2">
      {Array.from({ length: totalPages }).map((_, i) => (
        <button
          key={i}
          onClick={() => onPageChange(i + 1)}
          className={cn(
            "px-3 py-1 rounded-md border",
            currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-white hover:bg-gray-100"
          )}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
}
