
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

function App() {
  
  return (
    <Router>
      <Routes>
        {/* If not logged in, show Signup by default */}
        <Route path="/" element={<Register />} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* The "Secret" Dashboard Route */}
        <Route path="/dashboard" element={<Dashboard />} /> 
      </Routes>
    </Router>
  );
}

export default App;