import { Button } from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useAuth } from "../../providers/AuthProvider";
import styles from "./styles.module.scss";

const Header = () => {
    const navigate = useNavigate();
    const { status, logout } = useAuth();

    const handleLogout = async () => {
        const result = await Swal.fire({
            title: "Do you want to log out?",
            showCancelButton: true,
            confirmButtonText: "Log out",
            cancelButtonText: "Stay signed in",
        });
        if (!result.isConfirmed) return;

        try {
            await logout();
            navigate("/login", { replace: true });
        } catch {
            toast.error("Unable to log out right now. Please try again.");
        }
    };

    const isAuthenticated = status === "authenticated";
    const isAnonymous = status === "anonymous";

    return (
        <div className={styles.container}>
            <NavLink to="/home" className={styles.siteName}>MERN AUTH</NavLink>
            <div className={styles.navlinks}>
                <NavLink to="/home" className={styles.navlink}>Home</NavLink>
                {isAuthenticated && <NavLink to="/dashboard" className={styles.navlink}>Dashboard</NavLink>}
                {isAnonymous && <NavLink to="/login" className={styles.navlink}>Login</NavLink>}
                {isAnonymous && <NavLink to="/register" className={styles.navlink}>Register</NavLink>}
                {isAuthenticated && (
                    <Button className={styles.logoutButton} variant="contained" onClick={handleLogout}>
                        Logout
                    </Button>
                )}
            </div>
        </div>
    );
};

export default Header;
