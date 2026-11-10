import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Button, CircularProgress, TextField } from "@mui/material";
import styles from "./styles.module.scss";
import { useAuth } from "../../providers/AuthProvider";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [inputValue, setInputValue] = useState({ email: "", password: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        try {
            const { data } = await axios.post("/user/login", { ...inputValue, email: inputValue.email.trim() });
            if (!data.success || !data.user) throw new Error(data.message || "Unable to log in.");
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
                <h1 className={styles.heading}>Log in</h1>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <TextField
                        value={inputValue.email}
                        onChange={(event) => setInputValue((current) => ({ ...current, email: event.target.value }))}
                        name="email"
                        type="email"
                        label="Email address"
                        autoComplete="username"
                        size="small"
                        className={styles.emailInput}
                        required
                    />
                    <div className={styles.passwordContainer}>
                        <TextField
                            value={inputValue.password}
                            onChange={(event) => setInputValue((current) => ({ ...current, password: event.target.value }))}
                            name="password"
                            type={showPassword ? "text" : "password"}
                            label="Password"
                            autoComplete="current-password"
                            size="small"
                            className={styles.passwordInput}
                            inputProps={{ maxLength: 72 }}
                            required
                        />
                        <button type="button" className={styles.icon} style={{ border: 0, background: "transparent", color: "inherit", padding: 0, cursor: "pointer", lineHeight: 0 }} onClick={() => setShowPassword((shown) => !shown)} aria-label={showPassword ? "Hide password" : "Show password"}>
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>
                    <Button type="submit" variant="contained" className={styles.submitButton} disabled={isLoading}>
                        {isLoading ? <CircularProgress size={22} /> : "Log in"}
                    </Button>
                    <div className={styles.registerLink}>Need an account? <NavLink to="/register">Register</NavLink></div>
                </form>
            </div>
        </div>
    );
};

export default Login;
