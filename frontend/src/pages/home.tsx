import { FileUpload } from "@/components/file-uploader";
import { Footer } from "@/components/footer";
import { Header } from "@/components/Header";

export function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground w-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <FileUpload />
      </main>
      <Footer />
    </div>
  );
}
