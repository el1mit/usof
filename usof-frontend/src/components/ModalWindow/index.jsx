import React from 'react';

import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import styles from './ModalWindow.module.scss';

export const ModalWindow = ({ title, content, action, open, handleClose  }) => {
    return (
        <>
            <Modal
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <Box className={styles.modal}>
                        <Typography variant="h6" component="h2">
                            {title}
                        </Typography>
                        <Typography>
                            {content}
                        </Typography>
                        <div>
                            <Button onClick={action} sx={{ mr: 2 }} variant='contained' color='error'>
                                Yes
                            </Button>
                            <Button onClick={handleClose} variant='contained'>
                                No
                            </Button>
                        </div>
                    </Box>
                </Fade>
            </Modal>
        </>);
}