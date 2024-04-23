import { CircularProgress } from "@mui/material";
import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";

const wait = (time) => {
    return new Promise(resolve => setTimeout(resolve, time));
}

const Dashboard = lazy(() => wait(500).then(() => import("../pages/dashboard")));
const Home = lazy(() => wait(500).then(() => import("../pages/home")));
const Login = lazy(() => wait(500).then(() => import("../pages/login")));
const Register = lazy(() => wait(500).then(() => import("../pages/register")));


const Router = () => {
    return (
        <Suspense fallback={<CircularProgress sx={{ marginTop: "50px", marginLeft: "50%" }} />}>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </Suspense>
    )
}

export default Router

