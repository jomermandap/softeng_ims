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
        <Route path="/dashboard" element={<Inventory/>}/>
        <Route path="/dashboard" element={<ChartsPage/>}/>
        <Route path="/dashboard" element={<BillDetails/>}/>
      </Routes>
    </Router>
  );
}

export default App;
