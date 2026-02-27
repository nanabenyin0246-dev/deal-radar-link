import { useCommissionConfig, useUserCount } from "@/hooks/useCommissionConfig";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, PartyPopper } from "lucide-react";

const MilestoneProgress = () => {
  const { data: config } = useCommissionConfig();
  const { data: userCount } = useUserCount();

  if (!config) return null;

  const threshold = config.activation_threshold || 1000;
  const current = userCount || 0;
  const progress = Math.min((current / threshold) * 100, 100);

  return (
    <div className="bg-card border border-border rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-semibold flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" />
          Milestone Commission System
        </h3>
        {config.commission_active ? (
          <Badge className="bg-primary text-primary-foreground">
            <TrendingUp className="w-3 h-3 mr-1" /> Active at {(Number(config.commission_rate) * 100).toFixed(0)}%
          </Badge>
        ) : (
          <Badge variant="outline" className="text-secondary border-secondary">
            <PartyPopper className="w-3 h-3 mr-1" /> Growth Mode (0%)
          </Badge>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Registered Users</span>
          <span className="font-heading font-bold">{current.toLocaleString()} / {threshold.toLocaleString()}</span>
        </div>
        <Progress value={progress} className="h-3" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0%</span>
          <span>{progress.toFixed(1)}% to activation</span>
          <span>3% commission</span>
        </div>
      </div>

      {config.commission_activated_at && (
        <p className="text-xs text-muted-foreground mt-3">
          Activated on {new Date(config.commission_activated_at).toLocaleDateString()}
        </p>
      )}
    </div>
  );
};

export default MilestoneProgress;
