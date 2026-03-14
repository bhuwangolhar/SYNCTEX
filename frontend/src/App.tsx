import { BrowserRouter, Routes, Route } from "react-router-dom";

import RegisterPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/LandingPage";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/signup" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<HomePage />} />
        
      </Routes>

    </BrowserRouter>
  );
}

export default App;