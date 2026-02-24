import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";

import Home from "./pages/Home.jsx";
import Main from "./pages/Main.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import CardsForSale from "./pages/CardsForSale.jsx";
import SaleDetail from "./pages/SaleDetail.jsx";
import CardsWanted from "./pages/CardsWanted.jsx";
import Contact from "./pages/Contact.jsx";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/sale" element={<CardsForSale />} />
        <Route path="/sale/:id" element={<SaleDetail />} />

        <Route path="/wanted" element={<CardsWanted />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/main" element={<Main />} />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}