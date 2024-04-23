import React from 'react'
import styles from "./styles.module.scss";

const Home = () => {
    return (
        <div className={styles.container}>
            <div className={styles.main}>
                This is secure MERN Stack App with JWT-Based User Authentication and Authorization.
            </div>
        </div>
    )
}

export default Home

