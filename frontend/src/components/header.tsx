import { ModeToggle } from "./mode-toggle";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router";

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;

  return (
    <header className="w-full p-4 flex justify-between items-center bg-background">
      <h1 className="text-2xl font-bold text-foreground select-none	">
        AI Document Summarizer
      </h1>

      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => {
            if (pathname === "/history") navigate("/home");
            else navigate("/history");
          }}
        >
          {pathname === "/history" ? "Home" : "History"}
        </Button>

        <ModeToggle></ModeToggle>
      </div>
    </header>
  );
}
