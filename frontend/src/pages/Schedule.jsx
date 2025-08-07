import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, Repeat, Eye } from "lucide-react";
import DateTimePicker from "../components/DateTimePicker";
import PlatformSelect from "../components/PlatformSelect";

const Schedule = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("09:00");
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [repeatOption, setRepeatOption] = useState("once");
  const [selectedPost, setSelectedPost] = useState("");

  const availablePosts = [
    {
      id: 1,
      title: "TechCorp Product Launch",
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300",
      caption: "Exciting new product launch! 🚀 #Innovation #Tech"
    },
    {
      id: 2,
      title: "FitLife Motivation",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300",
      caption: "Transform your fitness journey with our new app! 💪"
    }
  ];

  const repeatOptions = [
    { value: "once", label: "Once" },
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" }
  ];

  const handleSchedulePost = () => {
    const scheduleData = {
      postId: selectedPost,
      date: selectedDate,
      time: selectedTime,
      platforms: selectedPlatforms,
      repeat: repeatOption
    };
    console.log("Scheduling post:", scheduleData);
  };

  const selectedPostData = availablePosts.find(post => post.id.toString() === selectedPost);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Schedule Post</h1>
        <p className="text-muted-foreground">
          Plan your content calendar and automate your posting schedule
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - Scheduling Options */}
        <div className="space-y-6">
          {/* Post Selection */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Select Post</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedPost} onValueChange={setSelectedPost}>
                <SelectTrigger className="glass-surface border-border/30">
                  <SelectValue placeholder="Choose a post to schedule" />
                </SelectTrigger>
                <SelectContent className="glass-card border-border/30">
                  {availablePosts.map((post) => (
                    <SelectItem key={post.id} value={post.id.toString()}>
                      {post.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Date & Time */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Date & Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DateTimePicker
                date={selectedDate}
                time={selectedTime}
                onDateChange={setSelectedDate}
                onTimeChange={setSelectedTime}
              />
            </CardContent>
          </Card>

          {/* Platforms */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Select Platforms</CardTitle>
            </CardHeader>
            <CardContent>
              <PlatformSelect
                selectedPlatforms={selectedPlatforms}
                onChange={setSelectedPlatforms}
              />
            </CardContent>
          </Card>

          {/* Repeat Options */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Repeat className="w-5 h-5 text-accent" />
                Repeat Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={repeatOption} onValueChange={setRepeatOption}>
                <SelectTrigger className="glass-surface border-border/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-card border-border/30">
                  {repeatOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Preview */}
        <div className="space-y-6">
          {/* Post Preview */}
          {selectedPostData && (
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-primary" />
                  Post Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <img
                    src={selectedPostData.image}
                    alt={selectedPostData.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="font-semibold mb-2">{selectedPostData.title}</h3>
                    <p className="text-muted-foreground">{selectedPostData.caption}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Schedule Summary */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Schedule Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date:</span>
                <span>{selectedDate.toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time:</span>
                <span>{selectedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Platforms:</span>
                <span>{selectedPlatforms.length || 0} selected</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Repeat:</span>
                <span className="capitalize">{repeatOption}</span>
              </div>
            </CardContent>
          </Card>

          {/* Schedule Action */}
          <Button
            onClick={handleSchedulePost}
            disabled={!selectedPost || selectedPlatforms.length === 0}
            className="w-full btn-gradient"
            size="lg"
          >
            <Clock className="w-5 h-5 mr-2" />
            Schedule Post
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Schedule;