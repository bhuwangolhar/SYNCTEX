import { BrowserRouter, Routes, Route } from "react-router-dom";

import RegisterPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/signup" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        
      </Routes>

    </BrowserRouter>
  );
}

export default App;