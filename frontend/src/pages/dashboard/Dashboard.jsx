import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { toast } from "react-toastify";
import styles from "./styles.module.scss";
import { Box, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import AddNewContact from "../../components/addNewContact";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import Swal from "sweetalert2";
import EditContact from "../../components/editContact";

const Dashboard = () => {
    const navigate = useNavigate();
    const [cookies, removeCookie] = useCookies([]);
    const [username, setUsername] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [contacts, setContacts] = useState([]);
    const [added, setAdded] = useState(false);
    const [editContactFlag, setEditContactFlag] = useState(false);
    const [editContact, setEditContact] = useState({});

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
            // console.log(response, "dashboard response");
            const username = response.data.username;
            setUsername(username);
            return response.data.success
                ? (setIsLoggedIn(true))
                : (removeCookie("token"), navigate("/login"));
        };
        verifyCookie();
        // console.log(cookies, "dashboard cookies");
    }, [cookies, navigate, removeCookie]);

    useEffect(() => {
        const getContacts = async () => {
            try {
                const config = {
                    method: "GET",
                    url: "/contact",
                    withCredentials: true,
                };
                const response = await axios(config);
                // console.log(response, "get contact response");
                if (response.data.success === true) {
                    setContacts(response.data.contacts);
                }
            } catch (error) {
                console.log(error, "get contact error");
                toast.error(error.message);
            }
        };
        getContacts();
        if (setAdded === true) {
            getContacts();
            setAdded(false);
        }
    }, [added, editContactFlag]);

    const handleEdit = (item) => {
        setEditContactFlag(true);
        setEditContact(item);
    };

    const handleDelete = (item) => {
        Swal.fire({
            title: "Do you want to delete the item with id: " + item._id,
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Delete",
            denyButtonText: `Don't delete`
        }).then((result) => {
            if (result.isConfirmed) {
                // console.log(response, "flter");
                // return;
                const deleteContact = async () => {
                    try {
                        const config = {
                            method: "DELETE",
                            url: "/contact",
                            withCredentials: true,
                            data: {
                                id: item._id
                            }
                        };
                        const response = await axios(config);
                        // console.log(response, "get contact response");
                        if (response.data.success === true) {
                            const filteredContacts = contacts.filter(contact => contact._id !== item._id);
                            setContacts(filteredContacts);
                        }
                    } catch (error) {
                        console.log(error, "get contact error");
                        toast.error(error.message);
                    }
                };
                deleteContact();
            }
        });
    };

    return (
        <>
            {isLoggedIn === false
                ? <CircularProgress sx={{ padding: "5px" }} />
                : <>

                    <div className={styles.container}>
                        <div className={styles.main}>
                            <h3 className={styles.heading}>Welcome <span>{username}</span></h3>
                            <AddNewContact added={added} setAdded={setAdded} />

                            <TableContainer component={Paper} sx={{ marginTop: "50px" }}>
                                <Table>
                                    <TableHead>
                                        <TableRow sx={{ backgroundColor: "#000" }}>
                                            <TableCell sx={{ color: "#fff" }}>Id</TableCell>
                                            <TableCell sx={{ color: "#fff" }}>Name</TableCell>
                                            <TableCell sx={{ color: "#fff" }}>Email</TableCell>
                                            <TableCell sx={{ color: "#fff" }}>Phone</TableCell>
                                            <TableCell sx={{ color: "#fff" }}>About</TableCell>
                                            <TableCell sx={{ color: "#fff" }}>Created at</TableCell>
                                            <TableCell sx={{ color: "#fff" }}>Updated at</TableCell>
                                            <TableCell sx={{ color: "#fff" }}>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {contacts.map((row) => (
                                            <TableRow key={row._id} sx={{ verticalALign: "top" }}>
                                                <TableCell>{row._id}</TableCell>
                                                <TableCell>{row.name}</TableCell>
                                                <TableCell>{row.email}</TableCell>
                                                <TableCell>{row.phone}</TableCell>
                                                <TableCell>{row.about}</TableCell>
                                                <TableCell>{row.createdAt}</TableCell>
                                                <TableCell>{row.updatedAt}</TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: "flex", gap: "30px" }}>
                                                        <FaEdit
                                                            style={{ color: "blue", fontSize: "20px" }}
                                                            onClick={() => handleEdit(row)}
                                                        />
                                                        <MdDeleteForever
                                                            style={{ color: "red", fontSize: "20px" }}
                                                            onClick={() => handleDelete(row)}
                                                        />
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            {editContactFlag === true
                                ? <EditContact
                                    editContactFlag={editContactFlag}
                                    setEditContactFlag={setEditContactFlag}
                                    editContact={editContact}
                                    setEditContact={setEditContact}
                                />
                                : <></>}
                        </div>
                    </div>
                </>}
        </>
    );
};

export default Dashboard;
