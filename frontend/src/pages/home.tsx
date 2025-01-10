import { FileUpload } from "@/components/file-uploader";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

export function HomePage() {
  return (
    <div className="flex flex-col bg-background text-foreground">
      {/* <Header /> */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <FileUpload />
      </main>
      {/* <Footer /> */}
    </div>
  );
}
