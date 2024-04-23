import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styles from "./styles.module.scss";

const EditContact = (props) => {
    console.log(props);
    const [editContactFlag, seteditContactFlag] = useState(props.editContactFlag);
    const [editContact, setEditContact] = useState(props.editContact);
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        props.setEditContactFlag(false);
    };

    useEffect(() => {
        if (editContactFlag === true) {
            handleClickOpen();
        }
    }, [editContactFlag]);

    useEffect(() => {
        console.log(editContact, "editcontact");
    }, [editContact]);

    const [isLoading, setIsLoading] = useState(false);

    const [name, setName] = useState(props.editContact.name);
    const [nameError, setNameError] = useState("");

    const [email, setEmail] = useState(props.editContact.email);
    const [emailError, setEmailError] = useState("");

    const [phone, setPhone] = useState(props.editContact.phone);
    const [phoneError, setPhoneError] = useState("");

    const [about, setAbout] = useState(props.editContact.about);
    const [aboutError, setAboutError] = useState("");

    const handleNameChange = (event) => {
        const regex = /[^a-zA-Z ]/ig;
        const value = event.target.value.replace(regex, "").slice(0, 20);
        setName(value);
        if (value.length < 3) {
            setNameError("Min: 3 char, Max: 20 char, A-Za-z");
        } else {
            setNameError("");
        }
    };

    const handleEmailChange = (event) => {
        const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        const isValid = regex.test(event.target.value);
        setEmail(event.target.value.substring(0, 40));
        if (!isValid) {
            setEmailError("Invalid email address");
        } else {
            setEmailError("");
        }
    };

    const handlePhoneChange = (event) => {
        const regex = /[^0-9]/ig;
        const value = event.target.value.replace(regex, "").slice(0, 10);
        setPhone(value);
        if (value.length !== 10) {
            setPhoneError("Size: 10 chars, 0-9");
        } else {
            setPhoneError("");
        }
    };

    const handleAboutChange = (event) => {
        const value = event.target.value.slice(0, 200);
        setAbout(value);
        if (value.length < 20) {
            setAboutError("Must be at least 20 chars");
        } else {
            setAboutError("");
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const data = { name, email, phone, about, id: props.editContact._id };
        if (nameError.length > 0 || emailError.length > 0 || phoneError.length > 0 || aboutError.length > 0) {
            return toast.warn("Form contains errors");
        }

        try {
            const config = {
                method: "PATCH",
                url: "/contact",
                withCredentials: true,
                data
            };
            setIsLoading(true);
            const response = await axios(config);
            console.log(response, "update contact response");
            if (response.data.success === true) {
                toast.success(response.data.message);
                props.setEditContact(false);
                handleClose();
            } else if (response.data.success === false) {
                toast.warn(response.data.error);
            }
        } catch (error) {
            console.log(error, "update contact error");
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            PaperProps={{
                component: 'form',
                onSubmit: handleSubmit,
            }}
        >
            <DialogTitle>Subscribe</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Update contact
                </DialogContentText>

                <TextField
                    value={name}
                    onChange={handleNameChange}
                    type="text"
                    label="Name"
                    size="small"
                    inputProps={{
                        autoComplete: "new-password",
                        form: {
                            autoComplete: "off",
                        },
                    }}
                    error={nameError.length > 0}
                    helperText={nameError.length > 0 ? nameError : ""}
                    fullWidth
                    sx={{ marginTop: "15px" }}
                />

                <TextField
                    value={email}
                    onChange={handleEmailChange}
                    type="text"
                    label="email"
                    size="small"
                    inputProps={{
                        autoComplete: "new-password",
                        form: {
                            autoComplete: "off",
                        },
                    }}
                    error={emailError.length > 0}
                    helperText={emailError.length > 0 ? emailError : ""}
                    fullWidth
                    sx={{ marginTop: "15px" }}
                />

                <TextField
                    value={phone}
                    onChange={handlePhoneChange}
                    type="text"
                    label="Phone"
                    size="small"
                    inputProps={{
                        autoComplete: "new-password",
                        form: {
                            autoComplete: "off",
                        },
                    }}
                    error={phoneError.length > 0}
                    helperText={phoneError.length > 0 ? phoneError : ""}
                    fullWidth
                    sx={{ marginTop: "15px" }}
                />

                <TextField
                    value={about}
                    onChange={handleAboutChange}
                    fullWidth
                    type="text"
                    label="About"
                    size="small"
                    inputProps={{
                        autoComplete: "new-password",
                        form: {
                            autoComplete: "off",
                        },
                    }}
                    multiline
                    rows={3}
                    error={aboutError.length > 0}
                    helperText={aboutError.length > 0 ? aboutError : ""}
                    sx={{ marginTop: "15px" }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} >Cancel</Button>
                <Button
                    type="submit"
                    variant="contained"
                    disabled={isLoading}
                    className={styles.submit}
                >
                    {isLoading
                        ? <CircularProgress sx={{ padding: "5px" }} />
                        : "Submit"}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default EditContact

