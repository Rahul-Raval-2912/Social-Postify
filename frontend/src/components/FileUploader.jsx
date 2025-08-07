import { useState, useRef } from "react";
import { Upload, X, Image } from "lucide-react";
import { Button } from "@/components/ui/button";

const FileUploader = ({ onFileSelect, accept = "image/*", multiple = false }) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      if (multiple) {
        onFileSelect(e.dataTransfer.files);
      } else {
        onFileSelect(e.dataTransfer.files[0]);
      }
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      if (multiple) {
        onFileSelect(e.target.files);
      } else {
        onFileSelect(e.target.files[0]);
      }
    }
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div
      className={`glass-surface border-2 border-dashed rounded-lg p-8 text-center transition-smooth ${
        dragActive ? "border-primary bg-primary/5" : "border-border/50"
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        className="hidden"
      />
      
      <div className="space-y-4">
        <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto">
          <Upload className="w-8 h-8 text-primary-foreground" />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2">
            {multiple ? "Upload Images" : "Upload Image"}
          </h3>
          <p className="text-muted-foreground text-sm">
            Drag and drop your {multiple ? "files" : "file"} here, or click to browse
          </p>
        </div>
        
        <Button onClick={onButtonClick} className="btn-gradient">
          <Image className="w-4 h-4 mr-2" />
          Choose {multiple ? "Files" : "File"}
        </Button>
        
        <p className="text-xs text-muted-foreground">
          Supports: JPG, PNG, GIF (Max 10MB)
        </p>
      </div>
    </div>
  );
};

export default FileUploader;