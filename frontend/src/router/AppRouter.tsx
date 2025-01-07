import { Home } from "@/pages/home";
import { Navigate, Route, Routes } from "react-router";

function AppRouter() {
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/" element={<Navigate to="/home" />} />
    </Routes>
  );
}

export default AppRouter;
