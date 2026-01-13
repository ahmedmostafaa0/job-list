"use client";
import { toast } from "sonner";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { CopyCheckIcon } from "lucide-react";

const CopyJobURL = ({ jobURL }: { jobURL: string }) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jobURL);
      toast.info("URL copied to clipboard!");
    } catch (error) {
      console.log(error);
      toast.error("failed to copy URL!");
    }
  };
  return (
    <DropdownMenuItem onClick={handleCopy}>
      <CopyCheckIcon className="size-4" />
      Copy Job URL
    </DropdownMenuItem>
  );
};

export default CopyJobURL;
