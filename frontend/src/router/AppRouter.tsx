import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { HistoryPage } from "@/pages/history";
import { HomePage } from "@/pages/home";
import SummaryPage from "@/pages/summary";
import { Navigate, Route, Routes } from "react-router";

function AppRouter() {
  return (
    <div className="flex flex-col min-h-screen w-screen">
      <Header />
      <div className="flex-grow w-full">
        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="*" element={<Navigate to="/home" />} />
          <Route path="/summary/:summaryId" element={<SummaryPage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default AppRouter;
