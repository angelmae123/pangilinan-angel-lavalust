import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import Login from "./pages/login";
import Register from "./pages/register";
import DisplayProd from "./pages/displayprod";
import AddProd from "./pages/addprod";
import EditProd from "./pages/editprod";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/products" element={<DisplayProd />} />
                <Route path="/add" element={<AddProd />} />
                <Route path="/edit/:id" element={<EditProd />} />
            </Routes>
            <ToastContainer/>
        </BrowserRouter>
        
    );
}

export default App;