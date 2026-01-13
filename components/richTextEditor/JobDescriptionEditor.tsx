"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Menubar from "./Menubar";
import Typography from "@tiptap/extension-typography";
import TextAlign from "@tiptap/extension-text-align";
import { useEffect, useState } from "react";
import { ControllerRenderProps } from "react-hook-form";

interface iAppProps{
  field: ControllerRenderProps<{
    jobTitle: string;
    employmentType: string;
    location: string;
    salaryFrom: number;
    salaryTo: number;
    jobDescription: string;
    benefits: string[];
    companyName: string;
    companyLocation: string;
    companyLogo: string;
    companyWebsite: string;
    companyDescription: string;
    listingDuration: number;
    companyXAccount?: string | undefined;
}, "jobDescription">
}

const JobDescriptionEditor = ({field} : iAppProps) => {
  const [, forceUpdate] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Typography,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'min-h-[300px] p-4 max-w-[95%] focus:outline-none'
      }
    },
    onUpdate({editor}) {
      field.onChange(JSON.stringify(editor.getJSON()))
    },
    content: field.value ? JSON.parse(field.value) : ''
  });

  useEffect(() => {
    const update = () => forceUpdate(v => v + 1)
    editor?.on('transaction', update)
    return () => {
      editor?.off('transaction', update)
    }
  }, [editor])


  return (
    <div className="w-[95%] md:w-full rounded-lg border overflow-hidden bg-card prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert">
      <Menubar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default JobDescriptionEditor;
