import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const ColorPicker = ({ color, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const presetColors = [
    "#8B5CF6", // Purple
    "#10B981", // Green
    "#F59E0B", // Yellow
    "#EF4444", // Red
    "#3B82F6", // Blue
    "#EC4899", // Pink
    "#8B5A2B", // Brown
    "#6B7280", // Gray
    "#F97316", // Orange
    "#84CC16", // Lime
  ];

  const handleColorChange = (newColor) => {
    onChange(newColor);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start gap-3 glass-surface border-border/30"
        >
          <div 
            className="w-6 h-6 rounded border border-border/50"
            style={{ backgroundColor: color }}
          />
          <span>{color}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 glass-card border-border/30">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Choose Color</label>
            <Input
              type="color"
              value={color}
              onChange={(e) => onChange(e.target.value)}
              className="w-full h-10 glass-surface border-border/30"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Preset Colors</label>
            <div className="grid grid-cols-5 gap-2">
              {presetColors.map((presetColor) => (
                <button
                  key={presetColor}
                  onClick={() => handleColorChange(presetColor)}
                  className="w-8 h-8 rounded border-2 transition-smooth hover:scale-110"
                  style={{ 
                    backgroundColor: presetColor,
                    borderColor: color === presetColor ? "white" : "transparent"
                  }}
                />
              ))}
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Hex Value</label>
            <Input
              type="text"
              value={color}
              onChange={(e) => onChange(e.target.value)}
              placeholder="#8B5CF6"
              className="glass-surface border-border/30"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ColorPicker;