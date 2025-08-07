import { useState } from "react";
import { X, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

const PreviewImage = ({ src, alt, onRemove }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative group glass-surface rounded-lg overflow-hidden">
      <div className="aspect-square">
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-smooth ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setIsLoaded(true)}
        />
        
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Overlay with actions */}
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-smooth flex items-center justify-center gap-2">
        <Button size="icon" variant="secondary" className="bg-white/20 hover:bg-white/30">
          <Eye className="w-4 h-4" />
        </Button>
        <Button size="icon" variant="secondary" className="bg-white/20 hover:bg-white/30">
          <Download className="w-4 h-4" />
        </Button>
        {onRemove && (
          <Button 
            size="icon" 
            variant="destructive" 
            onClick={onRemove}
            className="bg-destructive/80 hover:bg-destructive"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Remove button always visible if provided */}
      {onRemove && (
        <Button
          size="icon"
          variant="destructive"
          onClick={onRemove}
          className="absolute top-2 right-2 w-6 h-6 opacity-80 hover:opacity-100"
        >
          <X className="w-3 h-3" />
        </Button>
      )}
    </div>
  );
};

export default PreviewImage;