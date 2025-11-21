import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

const Logout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      logout();
      navigate("/", { replace: true });
    }, 3 * 1000);

    return () => clearTimeout(timer);
  }, [logout, navigate]);

  return (
    <div>
      <h2>You have been logged out.</h2>
      <p>Redirecting to home page...</p>
    </div>
  );
};

export default Logout;