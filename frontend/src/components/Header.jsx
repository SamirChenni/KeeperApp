import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import axios from "axios";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
function Header() {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await axios.post("/logout", {}, { withCredentials: true });
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <header>
      <div className="header">
        <VerifiedUserIcon style={{ color: "#fff" }} fontSize="large" />
        <h1>Keeper</h1>
      </div>
      <button
        type="button"
        onClick={handleLogout}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div className="header">
          <LogoutIcon style={{ color: "#fff" }} fontSize="medium" />
          <span style={{ color: "#fff", fontWeight: "bold", fontSize: "11pt" }}>
            Sign Out
          </span>
        </div>
      </button>
    </header>
  );
}

export default Header;
