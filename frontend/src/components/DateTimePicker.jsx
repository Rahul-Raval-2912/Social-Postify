import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

const DateTimePicker = ({ date, time, onDateChange, onTimeChange }) => {
  return (
    <div className="space-y-4">
      {/* Date Picker */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Select Date</Label>
        <Card className="glass-surface border-border/30">
          <CardContent className="p-3">
            <Calendar
              mode="single"
              selected={date}
              onSelect={onDateChange}
              disabled={(date) => date < new Date()}
              className="pointer-events-auto"
            />
          </CardContent>
        </Card>
      </div>

      {/* Time Picker */}
      <div>
        <Label htmlFor="time" className="text-sm font-medium mb-2 block">
          Select Time
        </Label>
        <Input
          id="time"
          type="time"
          value={time}
          onChange={(e) => onTimeChange(e.target.value)}
          className="glass-surface border-border/30"
        />
      </div>

      {/* Selected DateTime Display */}
      <div className="glass-surface p-3 rounded-lg">
        <p className="text-sm text-muted-foreground">Scheduled for:</p>
        <p className="font-medium">
          {date.toLocaleDateString()} at {time}
        </p>
      </div>
    </div>
  );
};

export default DateTimePicker;