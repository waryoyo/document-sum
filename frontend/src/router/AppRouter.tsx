import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { HomePage } from "@/pages/home";
import SummaryPage from "@/pages/summary";
import { Navigate, Route, Routes } from "react-router";

function AppRouter() {
  return (
    <div className="h-screen w-screen">
      <Header />
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="*" element={<Navigate to="/home" />} />
        <Route path="/summary/:summaryId" element={<SummaryPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default AppRouter;
