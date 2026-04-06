import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex justify-center items-center py-32 w-full min-h-[50vh]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-neutral-400" />
        <p className="text-neutral-500 text-sm font-medium animate-pulse">Loading product...</p>
      </div>
    </div>
  );
}
