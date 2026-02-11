import { useRef, useState, useCallback } from "react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { CloudUpload, FileText, TrashBin2 } from "@solar-icons/react";

export interface UploadedFile {
  id: string;
  name: string;
  size: string;
  progress: number;
  file: File;
  preview?: string;
}

interface FileDropZoneProps {
  // Files state
  files: UploadedFile[];
  onFilesChange: (files: UploadedFile[] | ((prevFiles: UploadedFile[]) => UploadedFile[])) => void;

  // Configuration
  maxFiles?: number;
  maxSizeMB?: number;
  acceptedTypes?: string[];
  showFileList?: boolean;
  showProgress?: boolean;
  simulateUpload?: boolean;

  // Styling
  className?: string;
  dropZoneClassName?: string;
  compact?: boolean;

  // Labels
  title?: string;
  subtitle?: string;
  browseText?: string;
}

const DEFAULT_ACCEPTED_TYPES = ["image/png", "image/jpeg", "application/pdf"];
const DEFAULT_MAX_SIZE_MB = 5;
const DEFAULT_MAX_FILES = 10;

export function FileDropZone({
  files,
  onFilesChange,
  maxFiles = DEFAULT_MAX_FILES,
  maxSizeMB = DEFAULT_MAX_SIZE_MB,
  acceptedTypes = DEFAULT_ACCEPTED_TYPES,
  showFileList = true,
  showProgress = true,
  simulateUpload = true,
  className,
  dropZoneClassName,
  compact = false,
  title = "Drop and drop your file or",
  subtitle,
  browseText = "Browse",
}: FileDropZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const getAcceptString = (): string => {
    return acceptedTypes
      .map((type) => {
        if (type === "image/png") return ".png";
        if (type === "image/jpeg") return ".jpg,.jpeg";
        if (type === "application/pdf") return ".pdf";
        return type;
      })
      .join(",");
  };

  const getFileTypeLabels = (): string => {
    const labels: string[] = [];
    if (acceptedTypes.includes("image/png")) labels.push("PNG");
    if (acceptedTypes.includes("image/jpeg")) labels.push("JPG");
    if (acceptedTypes.includes("application/pdf")) labels.push("PDF");
    return labels.join(" + ");
  };

  const simulateFileUpload = useCallback(
    (fileId: string, currentFiles: UploadedFile[]) => {
      if (!simulateUpload) {
        // Mark as complete immediately
        const updated = currentFiles.map((f) =>
          f.id === fileId ? { ...f, progress: 100 } : f
        );
        onFilesChange(updated);
        return;
      }

      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        onFilesChange((prevFiles) =>
          prevFiles.map((f) =>
            f.id === fileId ? { ...f, progress: Math.min(progress, 100) } : f
          )
        );
        if (progress >= 100) {
          clearInterval(interval);
        }
      }, 150);
    },
    [onFilesChange, simulateUpload]
  );

  const handleFiles = useCallback(
    (fileList: File[]) => {
      const remainingSlots = maxFiles - files.length;
      if (remainingSlots <= 0) {
        toast.error(`Maximum ${maxFiles} files allowed`);
        return;
      }

      const filesToProcess = fileList.slice(0, remainingSlots);
      const maxSizeBytes = maxSizeMB * 1024 * 1024;

      const newFiles: UploadedFile[] = [];

      filesToProcess.forEach((file) => {
        // Validate file type
        if (!acceptedTypes.includes(file.type)) {
          toast.error(
            `Invalid file type: ${file.name}. Allowed: ${getFileTypeLabels()}`
          );
          return;
        }

        // Validate file size
        if (file.size > maxSizeBytes) {
          toast.error(`File "${file.name}" exceeds ${maxSizeMB}MB limit`);
          return;
        }

        const newFile: UploadedFile = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: file.name,
          size: formatFileSize(file.size),
          progress: 0,
          file,
        };

        newFiles.push(newFile);
      });

      if (newFiles.length > 0) {
        const updatedFiles = [...files, ...newFiles];
        onFilesChange(updatedFiles);

        // Handle image previews
        newFiles.forEach((newFile) => {
          if (newFile.file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onloadend = () => {
              onFilesChange((prevFiles) =>
                prevFiles.map((f) =>
                  f.id === newFile.id
                    ? { ...f, preview: reader.result as string }
                    : f
                )
              );
            };
            reader.readAsDataURL(newFile.file);
          }

          // Simulate upload progress for each new file
          setTimeout(() => simulateFileUpload(newFile.id, updatedFiles), 100);
        });
      }
    },
    [
      files,
      maxFiles,
      maxSizeMB,
      acceptedTypes,
      onFilesChange,
      simulateFileUpload,
      getFileTypeLabels,
    ]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const droppedFiles = Array.from(e.dataTransfer.files);
      handleFiles(droppedFiles);
    },
    [handleFiles]
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      handleFiles(selectedFiles);
    }
    // Reset input value to allow selecting the same file again
    e.target.value = "";
  };

  const handleRemoveFile = (fileId: string) => {
    onFilesChange(files.filter((f) => f.id !== fileId));
  };

  const handleDropZoneClick = () => {
    fileInputRef.current?.click();
  };

  const defaultSubtitle =
    subtitle ||
    `File type: ${getFileTypeLabels()}, File limit: ${maxSizeMB}MB${maxFiles > 1 ? `, Max files: ${maxFiles}` : ""
    }`;

  return (
    <div className={cn("space-y-3", className)}>
      {/* Drop Zone */}
      <div
        className={cn(
          "border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors",
          isDragging
            ? "border-primary bg-primary/5 scale-[1.02]"
            : "border-gray-300 hover:border-primary/50 hover:bg-gray-50",
          compact ? "p-4" : "p-8",
          dropZoneClassName
        )}
        onClick={handleDropZoneClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={getAcceptString()}
          multiple={maxFiles > 1}
          onChange={handleFileSelect}
        />

        <CloudUpload
          className={cn(
            "mx-auto text-primary",
            compact ? "h-6 w-6 mb-2" : "h-10 w-10 mb-3"
          )}
        />

        <p className={cn("text-gray-600", compact ? "text-sm" : "")}>
          {title}{" "}
          <span className="text-primary font-montserrat-medium hover:underline">
            {browseText}
          </span>
        </p>

        <p
          className={cn(
            "text-gray-400 mt-1",
            compact ? "text-xs" : "text-sm"
          )}
        >
          {defaultSubtitle}
        </p>
      </div>

      {/* File List */}
      {showFileList && files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="bg-gray-50 rounded-lg p-3 border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {file.preview ? (
                    <img
                      src={file.preview}
                      alt={file.name}
                      className="h-10 w-10 object-cover rounded"
                    />
                  ) : (
                    <FileText className="h-8 w-8 text-red-500 flex-shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-montserrat-medium text-gray-900 text-sm truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">{file.size}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile(file.id);
                  }}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                >
                  <TrashBin2 className="h-4 w-4" />
                </button>
              </div>

              {showProgress && file.progress < 100 && (
                <div className="flex items-center gap-3 mt-2">
                  <Progress value={file.progress} className="flex-1 h-1.5" />
                  <span className="text-xs text-gray-500 w-10">
                    {file.progress}%
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Simplified hook for managing file state
export function useFileUpload(initialFiles: UploadedFile[] = []) {
  const [files, setFiles] = useState<UploadedFile[]>(initialFiles);

  const clearFiles = () => setFiles([]);

  const getCompletedFiles = () => files.filter((f) => f.progress === 100);

  return {
    files,
    setFiles,
    clearFiles,
    getCompletedFiles,
  };
}