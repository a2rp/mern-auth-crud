import React, { useEffect, useState } from "react"
import styles from "./styles.module.scss";
import axios from "axios";
import { toast } from "react-toastify";
import { Button, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";

const AddNewContact = (props) => {
    const [isLoading, setIsLoading] = useState(false);

    const [name, setName] = useState("");
    const [nameError, setNameError] = useState("Min: 3 char, Max: 20 char, A-Za-z");

    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("Invalid email");

    const [phone, setPhone] = useState("");
    const [phoneError, setPhoneError] = useState("Size: 10 chars, 0-9");

    const [about, setAbout] = useState("");
    const [aboutError, setAboutError] = useState("Must be at least 20 chars");

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

        const data = { name, email, phone, about };
        if (nameError.length > 0 || emailError.length > 0 || phoneError.length > 0 || aboutError.length > 0) {
            return toast.warn("Form contains errors");
        }

        try {
            const config = {
                method: "POST",
                url: "/contact",
                withCredentials: true,
                data
            };
            setIsLoading(true);
            const response = await axios(config);
            console.log(response, "add new contact response");
            if (response.data.success === true) {
                toast.success(response.data.message);
                props.setAdded(true);
            } else if (response.data.success === false) {
                toast.warn(response.data.error);
            }
        } catch (error) {
            console.log(error, "add new contact error");
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.heading}>Add Contact</div>

            <form className={styles.form} onSubmit={handleSubmit} noValidate autoComplete="off">
                <div className={styles.section1}>
                    <TextField
                        value={name}
                        onChange={handleNameChange}
                        type="text"
                        label="Name"
                        size="small"
                        className={styles.nameInput}
                        inputProps={{
                            autoComplete: "new-password",
                            form: {
                                autoComplete: "off",
                            },
                        }}
                        error={nameError.length > 0}
                        helperText={nameError.length > 0 ? nameError : ""}
                    />

                    <TextField
                        value={email}
                        onChange={handleEmailChange}
                        type="text"
                        label="email"
                        size="small"
                        className={styles.emailInput}
                        inputProps={{
                            autoComplete: "new-password",
                            form: {
                                autoComplete: "off",
                            },
                        }}
                        error={emailError.length > 0}
                        helperText={emailError.length > 0 ? emailError : ""}
                    />

                    <TextField
                        value={phone}
                        onChange={handlePhoneChange}
                        type="text"
                        label="Phone"
                        size="small"
                        className={styles.phoneInput}
                        inputProps={{
                            autoComplete: "new-password",
                            form: {
                                autoComplete: "off",
                            },
                        }}
                        error={phoneError.length > 0}
                        helperText={phoneError.length > 0 ? phoneError : ""}
                    />
                </div>

                <TextField
                    value={about}
                    onChange={handleAboutChange}
                    fullWidth
                    type="text"
                    label="About"
                    size="small"
                    className={styles.aboutInput}
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
                />

                <Button
                    type="submit"
                    variant="contained"
                    disabled={isLoading}
                    className={styles.submit}
                    fullWidth
                >
                    {isLoading
                        ? <CircularProgress sx={{ padding: "5px" }} />
                        : "Submit"}
                </Button>
            </form>
        </div>
    )
}

export default AddNewContact

