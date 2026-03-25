/* Page component that allows users to logout from their accounts */

/* Contexts */
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { useNavigate, useLocation } from "react-router-dom";

/* Components */
import LoadingIcon from "../../components/general/LoadingIcon";
import { useEffect } from "react";

export default function LogoutPage() {
    // Contexts
    const { logout } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        try {
            logout();
            
            // Return to previous page
            navigate(location.state?.from || '/', { replace: true });

            showToast("Successfully logged out!", "success");
        } catch (error) {
            showToast(error.message, "error");
        }
    }, []);

    return <LoadingIcon />;
};