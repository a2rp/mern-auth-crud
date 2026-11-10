import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Button, CircularProgress, TextField } from "@mui/material";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../../providers/AuthProvider";
import styles from "./styles.module.scss";

const initialValues = { email: "", username: "", password: "", confirmPassword: "" };

const Register = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [inputValue, setInputValue] = useState(initialValues);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();
    const { email, username, password, confirmPassword } = inputValue;

    const handleChange = (event) => {
        const { name, value } = event.target;
        setInputValue((current) => ({ ...current, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const passwordIsStrong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{12,72}$/.test(password);
        if (!passwordIsStrong || new TextEncoder().encode(password).length > 72) {
            toast.error("Use 12–72 characters with upper and lowercase letters, a number, and a symbol.");
            return;
        }
        if (password !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        setIsLoading(true);
        try {
            const { data } = await axios.post("/user/register", {
                ...inputValue,
                email: email.trim(),
                username: username.trim(),
            });
            if (!data.success || !data.user) throw new Error(data.message || "Unable to create your account.");
            login(data.user);
            toast.success(data.message);
            navigate("/dashboard", { replace: true });
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || "Unable to reach the API.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.main}>
                <h3 className={styles.heading}>Register user</h3>
                <form className={styles.form} onSubmit={handleSubmit} autoComplete="on">
                    <div className={styles.usernameContainer}>
                        <TextField
                            value={username}
                            onChange={handleChange}
                            name="username"
                            type="text"
                            label="Username"
                            size="small"
                            className={styles.usernameInput}
                            autoComplete="username"
                            inputProps={{ minLength: 3, maxLength: 32, pattern: "[A-Za-z0-9_]{3,32}" }}
                            required
                        />
                    </div>
                    <div className={styles.emailContainer}>
                        <TextField
                            value={email}
                            onChange={handleChange}
                            name="email"
                            type="email"
                            label="Email address"
                            size="small"
                            className={styles.emailInput}
                            autoComplete="email"
                            inputProps={{ maxLength: 254 }}
                            required
                        />
                    </div>
                    <div className={styles.passwordContainer}>
                        <TextField
                            value={password}
                            onChange={handleChange}
                            name="password"
                            type={showPassword ? "text" : "password"}
                            label="Password"
                            size="small"
                            className={styles.passwordInput}
                            autoComplete="new-password"
                            inputProps={{ minLength: 12, maxLength: 72 }}
                            required
                        />
                        <button type="button" className={styles.icon} style={{ border: 0, background: "transparent", color: "inherit", padding: 0, cursor: "pointer", lineHeight: 0 }} onClick={() => setShowPassword((shown) => !shown)} aria-label={showPassword ? "Hide password" : "Show password"}>
                            {showPassword ? <FaEye /> : <FaEyeSlash />}
                        </button>
                    </div>
                    <div className={styles.confirmPasswordContainer}>
                        <TextField
                            value={confirmPassword}
                            onChange={handleChange}
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            label="Confirm Password"
                            size="small"
                            className={styles.confirmPasswordInput}
                            autoComplete="new-password"
                            inputProps={{ minLength: 12, maxLength: 72 }}
                            required
                        />
                        <button type="button" className={styles.icon} style={{ border: 0, background: "transparent", color: "inherit", padding: 0, cursor: "pointer", lineHeight: 0 }} onClick={() => setShowConfirmPassword((shown) => !shown)} aria-label={showConfirmPassword ? "Hide password" : "Show password"}>
                            {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                        </button>
                    </div>
                    <Button type="submit" variant="contained" className={styles.submitButton} disabled={isLoading}>
                        {isLoading ? <CircularProgress size={22} /> : "Submit"}
                    </Button>
                    <div className={styles.loginLink}>
                        Already have an account? <NavLink to="/login">Login</NavLink>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
