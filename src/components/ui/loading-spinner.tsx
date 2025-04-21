
import { Loader } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  text?: string;
}

export const LoadingSpinner = ({
  size = "md",
  text,
  className,
  ...props
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8"
  };

  return (
    <div className={cn("flex flex-col items-center justify-center gap-2", className)} {...props}>
      <div className="relative">
        <div className="absolute inset-0 blur-sm bg-primary/30 rounded-full animate-pulse" />
        <Loader className={cn("animate-spin text-primary", sizeClasses[size])} />
      </div>
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
      )}
    </div>
  );
};
