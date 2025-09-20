import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import {
  X,
  Upload,
  FileText,
  CheckCircle,
  AlertTriangle,
  Image,
  FileSpreadsheet,
} from "lucide-react";

interface InvoiceUploaderProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: string[]) => void;
}

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  status: "uploading" | "success" | "error";
  progress: number;
  raw?: File;
}

export function InvoiceUploader({
  isOpen,
  onClose,
  onUpload,
}: InvoiceUploaderProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const newFiles: UploadedFile[] = Array.from(selectedFiles).map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
      status: "uploading",
      progress: 0,
      raw: file,
    }));

    setFiles((prev) => [...prev, ...newFiles]);

    // Simulate file upload progress
    newFiles.forEach((file, index) => {
      const interval = setInterval(() => {
        setFiles((prev) =>
          prev.map((f) => {
            if (f.name === file.name) {
              const newProgress = Math.min(
                f.progress + Math.random() * 30,
                100
              );
              return {
                ...f,
                progress: newProgress,
                status: newProgress === 100 ? "success" : "uploading",
              };
            }
            return f;
          })
        );
      }, 200);

      setTimeout(() => {
        clearInterval(interval);
        setFiles((prev) =>
          prev.map((f) =>
            f.name === file.name
              ? { ...f, progress: 100, status: "success" }
              : f
          )
        );
      }, 1500 + index * 200);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const removeFile = (fileName: string) => {
    setFiles((prev) => prev.filter((f) => f.name !== fileName));
  };

  const handleUpload = async () => {
    const readyFiles = files.filter((f) => f.status === "success" && f.raw);
    if (readyFiles.length === 0) return;

    const form = new FormData();
    readyFiles.forEach((f) => form.append("files", f.raw as File, f.name));

    try {
      const res = await fetch("http://localhost:3000/api/upload", {
        method: "POST",
        body: form,
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      onUpload(data.uploaded || readyFiles.map((f) => f.name));
    } catch (e) {
      console.error(e);
      setFiles((prev) =>
        prev.map((f) =>
          readyFiles.find((r) => r.name === f.name)
            ? { ...f, status: "error" }
            : f
        )
      );
    }
  };

  const getFileIcon = (type: string) => {
    if (type.includes("image")) return Image;
    if (type.includes("sheet") || type.includes("excel"))
      return FileSpreadsheet;
    return FileText;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="w-full max-w-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="bg-gray-900/95 border-gray-700 shadow-2xl backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-white flex items-center space-x-2">
                <Upload className="w-5 h-5" />
                <span>Upload Invoices</span>
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Upload Area */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 ${
                  isDragging
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-gray-600 hover:border-gray-500"
                }`}
              >
                <motion.div
                  animate={{ scale: isDragging ? 1.05 : 1 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto">
                    <Upload className="w-8 h-8 text-white" />
                  </div>

                  <div className="space-y-2">
                    <p className="text-white">
                      Drop your invoice files here or{" "}
                      <span className="text-blue-400 underline">browse</span>
                    </p>
                    <p className="text-gray-400 text-sm">
                      Supports PDF, PNG, JPG, Excel files up to 10MB each
                    </p>
                  </div>
                </motion.div>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.png,.jpg,.jpeg,.xlsx,.xls,.csv"
                  onChange={(e) => handleFileSelect(e.target.files)}
                  className="hidden"
                />
              </div>

              {/* File List */}
              {files.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-white">
                    Uploaded Files ({files.length})
                  </h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {files.map((file, index) => {
                      const FileIcon = getFileIcon(file.type);
                      return (
                        <motion.div
                          key={`${file.name}-${index}`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg"
                        >
                          <FileIcon className="w-8 h-8 text-blue-400 flex-shrink-0" />

                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm truncate">
                              {file.name}
                            </p>
                            <p className="text-gray-400 text-xs">
                              {formatFileSize(file.size)}
                            </p>

                            {file.status === "uploading" && (
                              <Progress
                                value={file.progress}
                                className="mt-2 h-1"
                              />
                            )}
                          </div>

                          <div className="flex items-center space-x-2 flex-shrink-0">
                            {file.status === "success" && (
                              <CheckCircle className="w-5 h-5 text-green-400" />
                            )}
                            {file.status === "error" && (
                              <AlertTriangle className="w-5 h-5 text-red-400" />
                            )}
                            {file.status === "uploading" && (
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                                className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full"
                              />
                            )}

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(file.name)}
                              className="text-gray-400 hover:text-red-400 p-1"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                <p className="text-gray-400 text-sm">
                  {files.filter((f) => f.status === "success").length} of{" "}
                  {files.length} files ready
                </p>

                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="border-gray-600 text-gray-300"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUpload}
                    disabled={
                      files.filter((f) => f.status === "success").length === 0
                    }
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                  >
                    Process Invoices
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
