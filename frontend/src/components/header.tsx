import { ModeToggle } from "./mode-toggle";

export function Header() {
  return (
    <header className="w-full p-4 flex justify-between items-center bg-background">
      <h1 className="text-2xl font-bold text-foreground">
        AI Document Summarizer
      </h1>
      <ModeToggle></ModeToggle>
    </header>
  );
}
