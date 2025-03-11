import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import Inventory from "./pages/Inventory"
import ChartsPage from "./pages/ChartsPage";
import BillDetails from "./pages/BillDetails"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<HomePage/>}/>
        <Route path="/inventory" element={<Inventory/>}/>
        <Route path="/charts" element={<ChartsPage/>}/>
        <Route path="/bills" element={<BillDetails/>}/>
      </Routes>
    </Router>
  );
}

export default App;
