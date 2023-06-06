import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import ReactMarkdown from 'react-markdown';

import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import Skeleton from '@mui/material/Skeleton';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';

import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

import { SideBlock } from '../index';
import { Typography } from '@mui/material';
import styles from './CommentsBlock.module.scss';
import { createCommentLike, deleteComment, deleteCommentLike } from '../../redux/slices/commentsSlice';

export const CommentsBlock = ({ items, children, userData, setEditing, isLoading = true }) => {
    const dispatch = useDispatch();

    const [snackPack, setSnackPack] = React.useState([]);
    const [openSnack, setOpenSnack] = React.useState(false);
    const [messageInfo, setMessageInfo] = React.useState(undefined);

    React.useEffect(() => {
        if (snackPack.length && !messageInfo) {
            setMessageInfo({ ...snackPack[0] });
            setSnackPack((prev) => prev.slice(1));
            setOpenSnack(true);
        } else if (snackPack.length && messageInfo && openSnack) {
            setOpenSnack(false);
        }
    }, [snackPack, messageInfo, openSnack]);

    const handleOpenSnack = (message) => {
        setSnackPack((prev) => [...prev, { message, key: new Date().getTime() }]);
    };

    const handleCloseSnack = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnack(false);
    };

    const handleExitedSnack = () => {
        setMessageInfo(undefined);
    };

    const handleCreateLike = async (data) => {
        try {
            const payload = { type: data.type };
            const likeData = await dispatch(createCommentLike({ id: data.id, payload }));
            if (likeData.meta.requestStatus === "fulfilled") {
                handleOpenSnack(likeData.payload.message);
            } else {
                handleDeleteLike(data.id);
            }

        } catch (err) {
            console.warn(err);
        }
    };

    const handleDeleteLike = async (id) => {
        try {
            const data = await dispatch(deleteCommentLike(id));
            handleOpenSnack(data.payload.message);
        } catch (err) {
            console.warn(err);
        }
    };

    const handleDeleteComment = async (id) => {
        await dispatch(deleteComment(id));
    };

    return (
        <>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center', }}
                key={messageInfo ? messageInfo.key : undefined}
                open={openSnack}
                autoHideDuration={6000}
                onClose={handleCloseSnack}
                TransitionProps={{ onExited: handleExitedSnack }}
                message={messageInfo ? messageInfo.message : undefined}
                action={
                    <IconButton
                        aria-label="close"
                        color="inherit"
                        sx={{ p: 0.5 }}
                        onClick={handleCloseSnack}
                    >
                        <CloseIcon />
                    </IconButton>
                }
            />

            <SideBlock title='Comments'>
                <List>
                    {(isLoading ? [...Array(5)] : items).map((obj, index) => (
                        <React.Fragment key={index}>
                            <ListItem alignItems='flex-start'>
                                <Link to={`/users/${obj.author_id}`}>
                                    <ListItemAvatar>
                                        {isLoading ? (
                                            <Skeleton
                                                variant='circular'
                                                width={40} height={40}
                                            />
                                        ) : (
                                            <Avatar
                                                alt={obj.login}
                                                src={`http://localhost:3001/avatar/${obj.avatar}`}
                                            />
                                        )}
                                    </ListItemAvatar>
                                </Link>

                                {isLoading ? (
                                    <div className={styles.allData}>
                                        <Skeleton variant='text' height={25} width={120} />
                                        <Skeleton variant='text' height={18} width={230} />
                                    </div>
                                ) : (
                                    <div className={styles.allData}>
                                        <div className={styles.firstRow}>
                                            <Link
                                                style={{ textDecoration: 'none', color: '#4361ee' }}
                                                to={`/users/${obj.author_id}`}
                                            >
                                                <Typography variant='subtitle1'>{obj.login}</Typography>
                                            </Link>
                                            <Typography variant='body2' className={styles.date}>
                                                {new Date(obj.publish_date).toLocaleDateString()}
                                            </Typography>
                                        </div>

                                        <ReactMarkdown children={obj.content} />

                                        <div className={styles.likes}>
                                            <IconButton style={{ marginLeft: -7 }} onClick={handleCreateLike.bind(this, { id: obj.id, type: 1 })} color='success'>
                                                <ThumbUpIcon className={styles.like} />
                                            </IconButton>
                                            <span>{obj.likes.count}</span>
                                            <IconButton onClick={handleCreateLike.bind(this, { id: obj.id, type: 0 })} color='error'>
                                                <ThumbDownIcon className={styles.dislike} />
                                            </IconButton>

                                            {((obj.author_id === userData?.id) || userData?.admin) && (
                                                <div style={{ marginLeft: 'auto', marginRight: '-20px' }} >
                                                    <IconButton onClick={setEditing.bind(this, obj.id)} color='primary'>
                                                        <EditIcon style={{ fontSize: '16px' }} />
                                                    </IconButton>

                                                    <IconButton onClick={handleDeleteComment.bind(this, obj.id)} color='secondary'>
                                                        <DeleteIcon style={{ fontSize: '18px' }} />
                                                    </IconButton>
                                                </div>
                                            )}
                                        </div>

                                    </div>
                                )}
                            </ListItem>
                            <Divider variant='inset' component='li' />
                        </React.Fragment>
                    ))}
                </List>
                {children}
            </SideBlock >
        </>
    );
};
