import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Box, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import Swal from "sweetalert2";
import AddNewContact from "../../components/addNewContact";
import EditContact from "../../components/editContact";
import { useAuth } from "../../providers/AuthProvider";
import styles from "./styles.module.scss";

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [contacts, setContacts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editContact, setEditContact] = useState(null);

    const loadContacts = useCallback(async () => {
        setIsLoading(true);
        try {
            const { data } = await axios.get("/contact");
            if (data.success) setContacts(data.contacts);
        } catch (error) {
            if (error.response?.status === 401) {
                try { await logout(); } catch { /* The route guard will show the login screen. */ }
            } else {
                toast.error(error.response?.data?.message || "Unable to load contacts.");
            }
        } finally {
            setIsLoading(false);
        }
    }, [logout]);

    useEffect(() => { loadContacts(); }, [loadContacts]);

    const handleDelete = async (contact) => {
        const result = await Swal.fire({
            title: "Delete this contact?",
            text: contact.name,
            showCancelButton: true,
            confirmButtonText: "Delete",
            cancelButtonText: "Cancel",
        });
        if (!result.isConfirmed) return;

        try {
            const { data } = await axios.delete("/contact", { data: { id: contact._id } });
            if (data.success) {
                setContacts((current) => current.filter((item) => item._id !== contact._id));
                toast.success(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Unable to delete this contact.");
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.main}>
                <h3 className={styles.heading}>Welcome <span>{user?.username}</span></h3>
                <AddNewContact onAdded={loadContacts} />

                {isLoading ? (
                    <CircularProgress sx={{ display: "block", margin: "50px auto" }} />
                ) : (
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
                                    <TableRow key={row._id} sx={{ verticalAlign: "top" }}>
                                        <TableCell>{row._id}</TableCell>
                                        <TableCell>{row.name}</TableCell>
                                        <TableCell>{row.email}</TableCell>
                                        <TableCell>{row.phone}</TableCell>
                                        <TableCell>{row.about}</TableCell>
                                        <TableCell>{new Date(row.createdAt).toLocaleString()}</TableCell>
                                        <TableCell>{new Date(row.updatedAt).toLocaleString()}</TableCell>
                                        <TableCell>
                                            <Box sx={{ display: "flex", gap: "20px" }}>
                                                <FaEdit
                                                    role="button"
                                                    aria-label={`Edit ${row.name}`}
                                                    tabIndex={0}
                                                    style={{ color: "blue", fontSize: "20px", cursor: "pointer" }}
                                                    onClick={() => setEditContact(row)}
                                                />
                                                <MdDeleteForever
                                                    role="button"
                                                    aria-label={`Delete ${row.name}`}
                                                    tabIndex={0}
                                                    style={{ color: "red", fontSize: "20px", cursor: "pointer" }}
                                                    onClick={() => handleDelete(row)}
                                                />
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                {editContact && (
                    <EditContact
                        key={editContact._id}
                        editContact={editContact}
                        onClose={() => setEditContact(null)}
                        onUpdated={loadContacts}
                    />
                )}
            </div>
        </div>
    );
};

export default Dashboard;
