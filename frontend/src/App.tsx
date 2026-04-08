import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import RegisterPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/LandingPage";
import DashboardPage from "./pages/Dashboard/Dashboard";
import { OrganizationProvider } from "./hooks/useOrganization";

function App() {
  return (
    <BrowserRouter>
      <OrganizationProvider>
        <Routes>

          <Route path="/signup" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard/*" element={<DashboardPage />} />
          
        </Routes>
      </OrganizationProvider>
    </BrowserRouter>
  );
}

export default App;
