import React from 'react';
import clsx from 'clsx';
import { Link, useNavigate } from 'react-router-dom';

import Card from '@mui/material/Card';
import Button from '@mui/material/Button';

import CreateIcon from '@mui/icons-material/Create';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import DeleteIcon from '@mui/icons-material/Delete';
import ThumbsUpDownIcon from '@mui/icons-material/ThumbsUpDown';
import StarIcon from '@mui/icons-material/Star';

import { ModalWindow } from './../index'
import { UserSkeleton } from './Skeleton';
import axios from '../../utils/axios';
import styles from './User.module.scss';
import { logout } from '../../redux/slices/authSlice';
import { useDispatch } from 'react-redux';

export const User = ({
    id,
    login,
    avatar,
    rating,
    full_name,
    role,
    userData,
    admin,
    postsCount,
    isLoading,
    isFullPage,
}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const inputImageRef = React.useRef(null);
    const [uploadedAvatar, setUploadedAvatar] = React.useState(avatar)

    const [openDelete, setOpenDelete] = React.useState(false);
    const handleOpenDelete = () => setOpenDelete(true);
    const handleCloseDelete = () => setOpenDelete(false);

    const handleUploadAvatar = async (event) => {
        try {
            const formData = new FormData();
            const avatar = event.target.files[0];
            formData.append('avatar', avatar);
            const { data } = await axios.patch('/users/avatar', formData);
            setUploadedAvatar(data.avatar)
        } catch (error) {
            console.warn(error);
        }
    }

    const handleDeleteAvatar = async () => {
        try {
            const { data } = await axios.delete('/users/avatar');
            setUploadedAvatar(data.avatar);
        } catch (error) {
            console.warn(error);
        }
    }

    const onClickDelete = async () => {
        try {
            await axios.delete(`/users/${id}`);
            dispatch(logout());
            window.localStorage.removeItem('token');
            handleCloseDelete();
            navigate(`/`);
        } catch (err) {
            console.warn(err);
        }
    }

    if (isLoading) {
        return <UserSkeleton />;
    }

    return (
        <Card className={clsx(styles.root, { [styles.rootFull]: isFullPage })}>
            <ModalWindow
                title='Confirm post solution'
                content='Are you sure you want to mark this post as solved?'
                action={onClickDelete}
                open={openDelete}
                handleClose={handleCloseDelete}
            />

            {!isFullPage ? (
                <div className={styles.wrapper}>
                    <img className={styles.avatar} src={`http://localhost:3001/avatar/${uploadedAvatar}`} alt={login} />

                    <h2 className={styles.login}>
                        {admin && (<StarIcon />)}<Link to={`/users/${id}`}>{login}</Link>
                    </h2>

                    <div className={styles.rating}>
                        <ThumbsUpDownIcon color='success'/>
                        <span style={{ marginLeft: '5px' }}>{rating}</span>
                    </div>
                </div>
            ) : (
                <div className={styles.wrapperFull}>

                    <div className={styles.avatarBlock}>
                        <img className={styles.avatarFull} src={`http://localhost:3001/avatar/${uploadedAvatar}`} alt={login} />
                        {(userData?.admin || (userData?.id === id)) && (
                            <Button onClick={handleDeleteAvatar} variant='contained' color='error'>
                                Delete Image
                                <PhotoCamera style={{ marginRight: '-5px', marginLeft: '5px' }} />
                            </Button>
                        )}
                    </div>
                    <h2 className={styles.userData}>
                        <span className={styles.loginFull}>{admin && (<StarIcon />)}{login}</span>
                        <span style={{ fontSize: '18px' }}>{full_name}</span>
                        <span style={{ fontSize: '18px' }}>{role}</span>
                        <div className={styles.rating}>
                            <ThumbsUpDownIcon color='success'/>
                            <span style={{ marginLeft: '5px' }}>{rating}</span>
                        </div>
                    </h2>

                    <div className={styles.editPanel}>
                        {(userData?.admin || (userData?.id === id)) && (<>
                            <Button onClick={() => inputImageRef.current.click()} variant='contained' color='success'>
                                Upload Avatar
                                <input ref={inputImageRef} onChange={handleUploadAvatar} accept='image/*' single='true' type='file' hidden />
                                <PhotoCamera style={{ marginRight: '-5px', marginLeft: '5px' }} />
                            </Button>

                            <Link to={`/users/${id}/edit`}>
                                <Button variant='contained' color='primary'>
                                    Edit Profile
                                    <CreateIcon style={{ marginRight: '-5px', marginLeft: '5px' }} />
                                </Button>
                            </Link>

                            <Button onClick={handleOpenDelete} variant='contained' color='error'>
                                Delete Profile
                                <DeleteIcon style={{ marginRight: '-5px', marginLeft: '5px' }} />
                            </Button>
                        </>)}
                    </div>
                </div>
            )}
        </Card >
    );
};
