import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectIsAuth } from '../../redux/slices/authSlice.js'

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import InputBase from '@mui/material/InputBase';

import CreateIcon from '@mui/icons-material/Create';
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';

import styles from './Header.module.scss';
import { UserInfo, ModalWindow } from '../index';

export const Header = ({ handleSearch, handleAddCategory }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isAuth = useSelector(selectIsAuth);
    const userData = useSelector((state) => state.auth.data);

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const onClickLogout = () => {
        dispatch(logout());
        window.localStorage.removeItem('token');
        handleClose();
        navigate('/');
    };

    return (
        <div className={styles.root}>
            <Container maxWidth='lg'>
                <div className={styles.inner}>
                    <Link className={styles.logo} to='/'>
                        <div>USOF</div>
                    </Link>

                    <div className={styles.search}>
                        <div className={styles.searchIcon}>
                            <SearchIcon />
                        </div>
                        <InputBase classes={{ root: styles.searchInput }}
                            placeholder="Search…"
                            onChange={(e) => { handleSearch(e.target.value) }}
                            inputProps={{ 'aria-label': 'search' }}
                        />
                    </div>

                    {isAuth && (
                        <UserInfo
                            login={userData.login}
                            avatar={`http://localhost:3001/avatar/${userData.avatar}`}
                            role={userData.admin ? "ADMIN" : "USER"}
                            rating={userData.rating}
                            author_id={userData.id}
                        />
                    )}


                    <div className={styles.buttons}>
                        {isAuth ? (
                            <>
                                {userData.admin && (
                                    <Link to='/new-category'>
                                        <Button onClick={handleAddCategory} variant='contained'>
                                            Create Category
                                            <CreateIcon style={{ marginRight: '-5px', marginLeft: '5px' }} />
                                        </Button>
                                    </Link>
                                )}
                                <Link to='/new-post'>
                                    <Button variant='contained'>New Post<CreateIcon style={{ marginRight: '-5px', marginLeft: '5px' }} /></Button>
                                </Link>

                                <Button onClick={handleOpen} variant='contained' color='error'>
                                    Logout <LogoutIcon style={{ marginRight: '-5px', marginLeft: '5px' }} />
                                </Button>

                                <ModalWindow
                                    title='Confirm logout'
                                    content='Are you sure you want to logout?'
                                    action={onClickLogout}
                                    open={open}
                                    handleClose={handleClose}
                                />
                            </>
                        ) : (
                            <>
                                <Link to='/login'>
                                    <Button variant='outlined'>Login</Button>
                                </Link>
                                <Link to='/register'>
                                    <Button variant='contained'>Register</Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </Container>
        </div>
    );
};
