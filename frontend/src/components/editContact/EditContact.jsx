import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import styles from "./styles.module.scss";

const validateContact = (values) => {
    const name = values.name.trim();
    const email = values.email.trim();
    const phone = values.phone.trim();
    const about = values.about.trim();
    const errors = {};
    if (!/^[a-zA-Z ]{3,20}$/.test(name)) errors.name = "Use 3–20 letters and spaces.";
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email address.";
    if (!/^\d{10}$/.test(phone)) errors.phone = "Enter a 10-digit phone number.";
    if (about.length < 20 || about.length > 200) errors.about = "Enter 20–200 characters.";
    return { errors, values: { name, email, phone, about } };
};

const EditContact = ({ editContact, onClose, onUpdated }) => {
    const [values, setValues] = useState({
        name: editContact.name,
        email: editContact.email,
        phone: editContact.phone,
        about: editContact.about,
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setValues((current) => ({ ...current, [name]: value }));
        setErrors((current) => ({ ...current, [name]: "" }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const checked = validateContact(values);
        setErrors(checked.errors);
        if (Object.keys(checked.errors).length) return;

        setIsLoading(true);
        try {
            const { data } = await axios.patch("/contact", { ...checked.values, id: editContact._id });
            if (!data.success) throw new Error(data.message || "Unable to update this contact.");
            toast.success(data.message);
            onClose();
            onUpdated();
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || "Unable to update this contact.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog
            open
            onClose={onClose}
            PaperProps={{ component: "form", onSubmit: handleSubmit }}
        >
            <DialogTitle>Edit contact</DialogTitle>
            <DialogContent>
                <DialogContentText>Update the contact details below.</DialogContentText>
                <TextField
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    type="text"
                    label="Name"
                    size="small"
                    inputProps={{ maxLength: 20 }}
                    error={Boolean(errors.name)}
                    helperText={errors.name || ""}
                    fullWidth
                    required
                    sx={{ marginTop: "15px" }}
                />
                <TextField
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    type="email"
                    label="Email"
                    size="small"
                    inputProps={{ maxLength: 254 }}
                    error={Boolean(errors.email)}
                    helperText={errors.email || ""}
                    fullWidth
                    required
                    sx={{ marginTop: "15px" }}
                />
                <TextField
                    name="phone"
                    value={values.phone}
                    onChange={handleChange}
                    type="tel"
                    label="Phone"
                    size="small"
                    inputProps={{ maxLength: 10, inputMode: "numeric" }}
                    error={Boolean(errors.phone)}
                    helperText={errors.phone || ""}
                    fullWidth
                    required
                    sx={{ marginTop: "15px" }}
                />
                <TextField
                    name="about"
                    value={values.about}
                    onChange={handleChange}
                    fullWidth
                    type="text"
                    label="About"
                    size="small"
                    inputProps={{ maxLength: 200 }}
                    multiline
                    rows={3}
                    error={Boolean(errors.about)}
                    helperText={errors.about || ""}
                    required
                    sx={{ marginTop: "15px" }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button type="submit" variant="contained" disabled={isLoading} className={styles.submit}>
                    {isLoading ? <CircularProgress size={22} /> : "Save"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditContact;
