import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Heart, Share, MessageCircle } from "lucide-react";

const PostCard = ({ post }) => {
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
      Instagram: "bg-pink-500/20 text-pink-300 border-pink-500/30",
      WhatsApp: "bg-green-500/20 text-green-300 border-green-500/30",
      Telegram: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      Email: "bg-purple-500/20 text-purple-300 border-purple-500/30"
    };

    return platforms.map((platform) => (
      <Badge 
        key={platform} 
        variant="outline" 
        className={`${platformColors[platform]} text-xs`}
      >
        {platform}
      </Badge>
    ));
  };

  return (
    <Card className="glass-card hover-glow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-lg">{post.client}</span>
          {getStatusBadge(post.status)}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Image */}
        <div className="aspect-square overflow-hidden rounded-lg">
          <img
            src={post.image}
            alt="Post content"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Caption */}
        <p className="text-sm text-foreground line-clamp-2">{post.caption}</p>

        {/* Platforms */}
        <div className="flex flex-wrap gap-1">
          {getPlatformBadges(post.platforms)}
        </div>

        {/* Engagement Stats */}
        {post.status === "posted" && (
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border/20">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <Heart className="w-4 h-4 text-red-400" />
                <span className="text-sm font-medium">{post.engagement}</span>
              </div>
              <p className="text-xs text-muted-foreground">Engagement</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <Share className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium">{Math.round(post.engagement * 0.1)}</span>
              </div>
              <p className="text-xs text-muted-foreground">Shares</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <MessageCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm font-medium">{Math.round(post.engagement * 0.05)}</span>
              </div>
              <p className="text-xs text-muted-foreground">Comments</p>
            </div>
          </div>
        )}

        {/* Action Button */}
        <Button variant="ghost" size="sm" className="w-full hover:bg-secondary/50">
          <Eye className="w-4 h-4 mr-2" />
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default PostCard;