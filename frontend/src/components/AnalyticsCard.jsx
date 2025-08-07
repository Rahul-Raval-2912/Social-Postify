import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

const AnalyticsCard = ({ title, value, change, icon: Icon, trend }) => {
  const isPositive = trend === "up";
  
  return (
    <Card className="glass-card hover-glow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm font-medium">{title}</p>
            <p className="text-3xl font-bold mt-2">{value}</p>
            <div className="flex items-center gap-1 mt-2">
              {isPositive ? (
                <TrendingUp className="w-4 h-4 text-green-400" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-400" />
              )}
              <span className={`text-sm font-medium ${
                isPositive ? "text-green-400" : "text-red-400"
              }`}>
                {change}
              </span>
            </div>
          </div>
          <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center glow-primary">
            <Icon className="w-6 h-6 text-primary-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsCard;