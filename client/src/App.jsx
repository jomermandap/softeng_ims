import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RequestAccess from "./pages/RequestAccess";
import Inventory from "./pages/Inventory"
import ChartsPage from "./pages/ChartsPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/request" element={<RequestAccess/>}/>
        <Route path="/dashboard" element={<HomePage/>}/>
        <Route path="/inventory" element={<Inventory/>}/>
        <Route path="/charts" element={<ChartsPage/>}/>
      </Routes>
    </Router>
  );
}

export default App;
