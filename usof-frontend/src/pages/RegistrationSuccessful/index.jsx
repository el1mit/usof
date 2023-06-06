import React from "react";

import Paper from "@mui/material/Paper";
import { Typography } from "@mui/material";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import styles from './RegistratonSuccessful.module.scss'

export const RegistrationSuccessful = () => {

    return (
        <Paper className={styles.root}>
            <Typography variant="h4">
                Confirm Email
            </Typography>

            <CheckCircleOutlineIcon color="success" fontSize="large" />

            <Typography variant="h5">
                Your account has been successfully created.
            </Typography>
            <Typography variant="h5">
                Please, check email and activate your account using the link in the letter.
            </Typography>
            <Typography variant="h5">
                After that you can log in.
            </Typography>
        </Paper>
    );

};
