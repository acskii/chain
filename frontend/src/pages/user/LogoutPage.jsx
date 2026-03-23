import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { useNavigate } from "react-router-dom";

export default function LogoutPage() {
    const { logout } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    try {
        logout();
        navigate('/');
        showToast("Successfully logged out!", "success");
    } catch (error) {
        showToast("Something went wrong when logging out!", "error");
    }
};