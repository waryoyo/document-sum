import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface LoadingAnimationProps {
  text: string;
}
// TODO: Fix the loading animation
export function LoadingAnimation({ text }: LoadingAnimationProps) {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center p-4">
      <div className="text-center">
        <Loader2 className="h-10 w-10 mx-auto animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}
