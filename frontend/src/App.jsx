import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../src/pages/Login";
import Register from "../src/pages/Register";
import Orders from "../src/pages/Orders";
import Menu from "../src/pages/Menu";
import Navbar from "./pages/Navbar";
import ProtectedRoute from "./pages/ProtectedRoute";
import Admin from "./pages/Admin";
import MenuManagement from "./pages/MenuManagement";
import AdminDashboard from "./pages/AdminDashboard";
import AIChat from "./pages/AIChat";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/menu"
          element={
            <ProtectedRoute>
              <Menu />
            </ProtectedRoute>
          }
        />
        <Route path="/admin" element={<Admin/>} />
        <Route path="/menu-management" element={<MenuManagement />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/ai" element={<AIChat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
