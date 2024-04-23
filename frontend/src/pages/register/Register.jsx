import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Button, CircularProgress, TextField } from "@mui/material";
import styles from "./styles.module.scss";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useCookies } from "react-cookie";

const Register = () => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [cookies, removeCookie] = useCookies([]);

    useEffect(() => {
        const verifyCookie = async () => {
            if (!cookies.token) {
                navigate("/login");
            }
            const config = {
                method: "POST",
                url: "/user",
                withCredentials: true,
            };

            const response = await axios(config);
            console.log(response, "dashboard response");
            if (response.data.success === true) {
                navigate("/dashboard");
            } else {
                setIsLoggedIn(false);
            }
        };
        verifyCookie();
    }, [cookies, navigate, removeCookie]);

    const [inputValue, setInputValue] = useState({
        email: "",
        username: "",
        password: "",
        confirmPassword: ""
    });
    const [passwordType, setPasswordType] = useState("password");
    const [confirmPasswordType, setConfirmPasswordType] = useState("password");

    const { email, username, password, confirmPassword } = inputValue;
    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setInputValue({
            ...inputValue,
            [name]: value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const config = {
                method: "POST",
                url: "/user/register",
                withCredentials: true,
                data: { ...inputValue }
            };
            // console.log(config, "config");
            setIsLoading(true);
            const response = await axios(config);
            console.log(response.data, "response");
            if (response.data.success === true) {
                toast.success(response.data.message);
                setInputValue({
                    ...inputValue,
                    email: "",
                    username: "",
                    password: "",
                    confirmPassword: ""
                });
                navigate("/dashboard");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {isLoggedIn === true
                ? <CircularProgress />
                : <>
                    <div className={styles.container}>
                        <div className={styles.main}>
                            <h3 className={styles.heading}>Register user</h3>
                            <form className={styles.form} onSubmit={handleSubmit} noValidate autoComplete="off">
                                <div className={styles.usernameContainer}>
                                    <TextField
                                        value={username}
                                        onChange={handleOnChange}
                                        name="username"
                                        type="text"
                                        label="Username"
                                        size="small"
                                        className={styles.usernameInput}
                                        inputProps={{
                                            autoComplete: 'new-password',
                                            form: {
                                                autoComplete: 'off',
                                            },
                                        }}
                                    />
                                </div>

                                <div className={styles.emailContainer}>
                                    <TextField
                                        value={email}
                                        onChange={handleOnChange}
                                        name="email"
                                        type="email"
                                        label="Email address"
                                        size="small"
                                        className={styles.emailInput}
                                        inputProps={{
                                            autoComplete: 'new-password',
                                            form: {
                                                autoComplete: 'off',
                                            },
                                        }}
                                    />
                                </div>

                                <div className={styles.passwordContainer}>
                                    <TextField
                                        value={password}
                                        onChange={handleOnChange}
                                        name="password"
                                        type={passwordType}
                                        label="Password"
                                        size="small"
                                        className={styles.passwordInput}
                                        inputProps={{
                                            autoComplete: 'new-password',
                                            form: {
                                                autoComplete: 'off',
                                            },
                                        }}
                                    />
                                    {passwordType === "password"
                                        ? <FaEyeSlash className={styles.icon} onClick={() => setPasswordType("text")} />
                                        : <FaEye className={styles.icon} onClick={() => setPasswordType("password")} />
                                    }
                                </div>

                                <div className={styles.confirmPasswordContainer}>
                                    <TextField
                                        value={confirmPassword}
                                        onChange={handleOnChange}
                                        name="confirmPassword"
                                        type={confirmPasswordType}
                                        label="Confirm Password"
                                        size="small"
                                        className={styles.confirmPasswordInput}
                                        inputProps={{
                                            autoComplete: 'new-password',
                                            form: {
                                                autoComplete: 'off',
                                            },
                                        }}
                                    />
                                    {confirmPasswordType === "password"
                                        ? <FaEyeSlash className={styles.icon} onClick={() => setConfirmPasswordType("text")} />
                                        : <FaEye className={styles.icon} onClick={() => setConfirmPasswordType("password")} />
                                    }
                                </div>

                                <Button
                                    type="submit"
                                    variant="contained"
                                    className={styles.submitButton}
                                    disabled={isLoading}
                                >
                                    {isLoading
                                        ? <CircularProgress sx={{ padding: "5px" }} />
                                        : "Submit"}
                                </Button>

                                <div className={styles.loginLink}>
                                    Already have an account? <NavLink to={"/login"}>Login</NavLink>
                                </div>
                            </form>
                        </div>
                    </div>
                </>}
        </>
    );
};

export default Register;

