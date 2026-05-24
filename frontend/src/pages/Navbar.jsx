import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const logoutFunction = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return <button onClick={logoutFunction}>Logout</button>;
}

export default Navbar;