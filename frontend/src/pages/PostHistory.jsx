import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, Download, Eye, TrendingUp } from "lucide-react";

const PostHistory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPlatform, setFilterPlatform] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const posts = [
    {
      id: 1,
      date: "2024-01-15",
      client: "TechCorp",
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300",
      caption: "Exciting new product launch! 🚀 #Innovation #Tech",
      platforms: ["Instagram", "WhatsApp"],
      engagement: 1234,
      likes: 892,
      shares: 156,
      comments: 186,
      status: "posted"
    },
    {
      id: 2,
      date: "2024-01-14",
      client: "FitLife",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300",
      caption: "Transform your fitness journey with our new app! 💪",
      platforms: ["Instagram", "Telegram"],
      engagement: 892,
      likes: 645,
      shares: 123,
      comments: 124,
      status: "posted"
    },
    {
      id: 3,
      date: "2024-01-16",
      client: "FoodieDelight",
      image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=300",
      caption: "Delicious recipes made simple. Join us! 🍽️",
      platforms: ["Instagram", "Email"],
      engagement: 0,
      likes: 0,
      shares: 0,
      comments: 0,
      status: "scheduled"
    },
    {
      id: 4,
      date: "2024-01-13",
      client: "TechCorp",
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300",
      caption: "Behind the scenes of our development process",
      platforms: ["WhatsApp"],
      engagement: 0,
      likes: 0,
      shares: 0,
      comments: 0,
      status: "failed"
    }
  ];

  const getStatusBadge = (status) => {
    const variants = {
      posted: "default",
      scheduled: "secondary", 
      failed: "destructive"
    };
    
    return (
      <Badge variant={variants[status]} className="capitalize">
        {status}
      </Badge>
    );
  };

  const getPlatformBadges = (platforms) => {
    const platformColors = {
      Instagram: "bg-pink-500/20 text-pink-300",
      WhatsApp: "bg-green-500/20 text-green-300",
      Telegram: "bg-blue-500/20 text-blue-300",
      Email: "bg-purple-500/20 text-purple-300"
    };

    return platforms.map((platform) => (
      <Badge 
        key={platform} 
        variant="outline" 
        className={`${platformColors[platform]} border-current`}
      >
        {platform}
      </Badge>
    ));
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.caption.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform = filterPlatform === "all" || post.platforms.includes(filterPlatform);
    const matchesStatus = filterStatus === "all" || post.status === filterStatus;
    
    return matchesSearch && matchesPlatform && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Post History</h1>
          <p className="text-muted-foreground">
            Track your social media posts performance and engagement
          </p>
        </div>
        
        <Button className="btn-glass gap-2">
          <Download className="w-4 h-4" />
          Export Data
        </Button>
      </div>

      {/* Filters */}
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search posts, clients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 glass-surface border-border/30"
                />
              </div>
            </div>
            
            <Select value={filterPlatform} onValueChange={setFilterPlatform}>
              <SelectTrigger className="w-48 glass-surface border-border/30">
                <SelectValue placeholder="All Platforms" />
              </SelectTrigger>
              <SelectContent className="glass-card border-border/30">
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="Instagram">Instagram</SelectItem>
                <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                <SelectItem value="Telegram">Telegram</SelectItem>
                <SelectItem value="Email">Email</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48 glass-surface border-border/30">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="glass-card border-border/30">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="posted">Posted</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Posts Grid */}
      <div className="grid gap-6">
        {filteredPosts.map((post) => (
          <Card key={post.id} className="glass-card hover-glow">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Image */}
                <div className="flex-shrink-0">
                  <img
                    src={post.image}
                    alt="Post content"
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{post.client}</h3>
                      <p className="text-muted-foreground text-sm">{post.date}</p>
                    </div>
                    {getStatusBadge(post.status)}
                  </div>

                  <p className="text-foreground">{post.caption}</p>

                  <div className="flex flex-wrap gap-2">
                    {getPlatformBadges(post.platforms)}
                  </div>

                  {/* Engagement Stats */}
                  {post.status === "posted" && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border/20">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-primary">{post.engagement}</p>
                        <p className="text-xs text-muted-foreground">Total Engagement</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-accent">{post.likes}</p>
                        <p className="text-xs text-muted-foreground">Likes</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-400">{post.shares}</p>
                        <p className="text-xs text-muted-foreground">Shares</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-400">{post.comments}</p>
                        <p className="text-xs text-muted-foreground">Comments</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <Button size="icon" variant="ghost" className="hover:bg-secondary/50">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="hover:bg-secondary/50">
                    <TrendingUp className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No posts found matching your filters.</p>
        </div>
      )}
    </div>
  );
};

export default PostHistory;