import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/ui/shadcn-io/dropzone";
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ImageUploadPreviewProps {
  defaultValue?: string;
  className?: string;
  imageClassName?: string;
  file?: File | null;
  onChange: (file: File | null) => void;
  disabled?: boolean;
}

const ImageUploadPreview = ({
  defaultValue,
  className,
  imageClassName,
  file,
  onChange,
  disabled = false,
}: ImageUploadPreviewProps) => {
  const [filePreview, setFilePreview] = useState<string | undefined>(
    defaultValue
  );

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === "string") {
          setFilePreview(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    } else if (!file && !defaultValue) {
      setFilePreview(undefined);
    }
  }, [file, defaultValue]);

  const handleDrop = (files: File[]) => {
    if (files.length === 0 || disabled) return;
    const selectedFile = files[0];
    onChange(selectedFile);
  };

  const handleRemove = () => {
    onChange(null);
    setFilePreview(defaultValue);
  };

  const mockFilePreview = React.useMemo(() => {
    // create fake file object with name and type
    if (defaultValue) {
      return [new File([], defaultValue, { type: "image/png" })];
    }
    return undefined;
  }, [defaultValue]);
  React.useEffect(() => {
    setFilePreview(defaultValue);
  }, [defaultValue]);
  console.log(mockFilePreview, defaultValue);
  return (
    <div className="space-y-2">
      <Dropzone
        accept={{ "image/*": [".png", ".jpg", ".jpeg", ".webp"] }}
        onDrop={handleDrop}
        onError={console.error}
        disabled={disabled}
        src={file ? [file] : mockFilePreview}
        className={cn("relative", className)}
      >
        <DropzoneEmptyState />
        <DropzoneContent>
          {filePreview && (
            <div className="flex justify-center w-full">
              <img
                alt="Preview"
                className={cn(
                  "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-cover rounded-lg",
                  imageClassName
                )}
                src={filePreview}
              />
              {!disabled && (
                <button
                  type="button"
                  onClick={handleRemove}
                  className="absolute top-2 right-2  text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-slate-200"
                >
                  ×
                </button>
              )}
            </div>
          )}
        </DropzoneContent>
      </Dropzone>
    </div>
  );
};

export default ImageUploadPreview;
