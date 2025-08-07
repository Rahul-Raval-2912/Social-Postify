import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, Calendar, Eye } from "lucide-react";
import AnalyticsCard from "../components/AnalyticsCard";
import PostCard from "../components/PostCard";

const Dashboard = () => {
  const kpis = [
    {
      title: "Total Posts",
      value: "142",
      change: "+12%",
      icon: Calendar,
      trend: "up"
    },
    {
      title: "Engagement Rate",
      value: "8.4%",
      change: "+2.1%",
      icon: TrendingUp,
      trend: "up"
    },
    {
      title: "Active Clients",
      value: "23",
      change: "+3",
      icon: Users,
      trend: "up"
    },
    {
      title: "Total Views",
      value: "45.2K",
      change: "+18%",
      icon: Eye,
      trend: "up"
    }
  ];

  const recentPosts = [
    {
      id: 1,
      client: "TechCorp",
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400",
      caption: "Exciting new product launch! 🚀 #Innovation #Tech",
      platforms: ["Instagram", "WhatsApp"],
      engagement: 1200,
      status: "posted"
    },
    {
      id: 2,
      client: "FitLife",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
      caption: "Transform your fitness journey with our new app! 💪",
      platforms: ["Instagram", "Telegram"],
      engagement: 892,
      status: "posted"
    },
    {
      id: 3,
      client: "FoodieDelight",
      image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400",
      caption: "Delicious recipes made simple. Join us! 🍽️",
      platforms: ["Instagram", "Email"],
      engagement: 645,
      status: "scheduled"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your social media.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => (
          <AnalyticsCard key={index} {...kpi} />
        ))}
      </div>

      {/* Performance Chart */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Performance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center glass-surface rounded-lg">
            <p className="text-muted-foreground">Chart Component Placeholder</p>
          </div>
        </CardContent>
      </Card>

      {/* Recent Posts */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Recent Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;