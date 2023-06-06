import React from 'react';
import { Link } from 'react-router-dom';

import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

import styles from './SideBlock.module.scss';

export const SideBlock = ({ title, children }) => {
    return (
        <Paper classes={{ root: styles.root }}>
            <Link
                to='/'
                style={{ textDecoration: 'none', color: 'black' }}
            >
                <Typography variant='h6' classes={{ root: styles.title }}>
                    {title}
                </Typography>
            </Link>
            {children}
        </Paper>
    );
};
