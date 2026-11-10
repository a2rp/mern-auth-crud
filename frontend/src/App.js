import React from "react";
import styles from "./styles.module.scss";
import Router from "./router";
import Header from "./components/header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { AuthProvider } from "./providers/AuthProvider";

const apiOrigin = (process.env.REACT_APP_API_URL || "http://localhost:1198").replace(/\/+$/, "");
axios.defaults.baseURL = `${apiOrigin}/api`;
axios.defaults.withCredentials = true;

const App = () => {
    return (
        <AuthProvider>
            <div className={styles.container}>
                <Header />
                <div className={styles.main}>
                    <div className={styles.routerContainer}><Router /></div>
                </div>
            </div>

            <ToastContainer />
        </AuthProvider>
    )
}

export default App

