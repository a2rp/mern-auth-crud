import React from "react";
import styles from "./styles.module.scss";
import Router from "./router";
import Header from "./components/header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const App = () => {
    axios.defaults.baseURL = "http://localhost:1198/api";

    return (
        <>
            <div className={styles.container}>
                <Header />
                <div className={styles.main}>
                    <div className={styles.routerContainer}><Router /></div>
                </div>
            </div>

            <ToastContainer />
        </>
    )
}

export default App

