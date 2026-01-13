"use client";

import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";
import { Heart, Loader2, Loader2Icon } from "lucide-react";
import Image from "next/image";

interface iAppProps {
  text: string;
  imageSrc?: string;
  width?: string
  variant?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null
    | undefined;
}

interface iAppProps2{
  text: string,
  icon: React.ReactNode,
  variant?: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined
}


export function SaveJobButton({ savedJob }: { savedJob: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button
      variant="outline"
      disabled={pending}
      type="submit"
      className="flex items-center gap-2"
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Saving...</span>
        </>
      ) : (
        <>
          <Heart
            className={`size-4 transition-colors ${
              savedJob ? "fill-current text-red-500" : ""
            }`}
          />
          {savedJob ? "Saved" : "Save Job"}
        </>
      )}
    </Button>
  );
}

export function ApplyJobButton({ appliedJob }: { appliedJob: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button
      disabled={pending || appliedJob}
      type="submit"
      className="flex items-center gap-2 w-full"
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Applying</span>
        </>
      ) : (
        <>
          {appliedJob ? "Applied" : "Apply Job"}
        </>
      )}
    </Button>
  );
}

export const GeneralButton = ({ text, icon, variant }: iAppProps2) => {
  const { pending } = useFormStatus();
  return (
    <Button variant={variant} disabled={pending}>
      {pending ? (
        <>
          <Loader2Icon className="animate-spin size-4" />
          <span>Submitting...</span>
        </>
      ) : (
        <>
          {icon && <div>{icon}</div>}
          <span>{text}</span>
        </>
      )}
    </Button>
  );
};

const SubmitButton = ({ text, imageSrc, variant, width }: iAppProps) => {
  const { pending } = useFormStatus();
  return (
    <Button className={width} variant={variant} disabled={pending}>
      {pending ? (
        <>
          <Loader2Icon className="animate-spin size-4" />
          <span>Submitting...</span>
        </>
      ) : (
        <>
          {imageSrc && <Image src={imageSrc} alt="Icon" width={16} height={16} />}
          <span>{text}</span>
        </>
      )}
    </Button>
  );
};



export default SubmitButton;
