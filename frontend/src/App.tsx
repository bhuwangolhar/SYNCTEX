import { BrowserRouter, Routes, Route } from "react-router-dom";

import RegisterPage from "./pages/SignupPage";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/signup" element={<RegisterPage />} />
        
      </Routes>

    </BrowserRouter>
  );
}

export default App;