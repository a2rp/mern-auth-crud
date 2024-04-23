import React, { useEffect, useState } from 'react'
import styles from "./styles.module.scss";
import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import Swal from 'sweetalert2';
import { useCookies } from 'react-cookie';
import axios from 'axios';

const Header = () => {
    const [cookies, removeCookie] = useCookies([]);
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

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
            // console.log(response, "headers response");
            // const username = response.data.username;
            if (response.data.success === true) {
                setIsLoggedIn(true);
            } else {
                setIsLoggedIn(false);
            }
        };
        verifyCookie();
        // console.log(cookies, "header cookies");
    }, [cookies, navigate, removeCookie]);

    const handleLogout = () => {
        Swal.fire({
            title: "Do you want to logout?",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Logout",
            denyButtonText: `Don't logout`
        }).then((result) => {
            if (result.isConfirmed) {
                removeCookie("token");
                navigate("/login");
            }
        });
    };

    return (
        <div className={styles.container}>
            <NavLink to="/home" className={styles.siteName}>MERN AUTH</NavLink>
            <div className={styles.navlinks}>
                <NavLink to="/home" className={styles.navlink}>Home</NavLink>
                {isLoggedIn === true
                    && <NavLink to="/dashboard" className={styles.navlink}>Dashboard</NavLink>}
                {isLoggedIn === false
                    && <NavLink to="/login" className={styles.navlink}>Login</NavLink>}
                {isLoggedIn === false
                    && <NavLink to="/register" className={styles.navlink}>Register</NavLink>}
                {isLoggedIn === true
                    && <Button
                        className={styles.logoutButton}
                        variant="contained"
                        onClick={handleLogout}
                    >Logout</Button>}
            </div>
        </div>
    )
}

export default Header


