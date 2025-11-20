import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface FeatureCardProps {
  title: string;
  icon: LucideIcon;
  gradient: string;
  to: string;
}

export const FeatureCard = ({ title, icon: Icon, gradient, to }: FeatureCardProps) => {
  return (
    <Link to={to} className="block">
      <Card
        className={cn(
          "relative overflow-hidden p-6 h-36 flex flex-col items-center justify-center text-center transition-all hover:scale-105 hover:shadow-lg cursor-pointer",
          gradient
        )}
      >
        <Icon className="h-10 w-10 mb-3 text-white" strokeWidth={2} />
        <h3 className="text-white font-semibold text-lg">{title}</h3>
      </Card>
    </Link>
  );
};
