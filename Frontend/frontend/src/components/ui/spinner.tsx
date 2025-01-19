import { cn } from "@/lib/utils";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
}

export function Spinner({ className, size = "md", ...props }: SpinnerProps) {
  return (
    <div
      className={cn(
        "animate-spin rounded-full border-t-2 border-primary",
        {
          "h-4 w-4 border-2": size === "sm",
          "h-8 w-8 border-4": size === "md",
          "h-16 w-16 border-8": size === "lg",
        },
        className
      )}
      {...props}
    />
  );
}
