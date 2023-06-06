import React from 'react';
import clsx from 'clsx';
import { Link, useNavigate } from 'react-router-dom';
import ModalImage from "react-modal-image";
import { useDispatch } from 'react-redux';

import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';

import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import CommentIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import DoneRoundedIcon from '@mui/icons-material/DoneRounded';
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded';

import styles from './Post.module.scss';
import { ModalWindow, UserInfo } from '../index';
import { PostSkeleton } from './Skeleton';
import { editPost, removePost, createPostLike, deletePostLike } from '../../redux/slices/postsSlice';

export const Post = ({
    id,
    author_id,
    title,
    avatar,
    login,
    full_name,
    publish_date,
    likesCount,
    commentsCount,
    categories,
    children,
    status,
    images,
    isFullPost,
    isLoading,
    isEditable,
    setLike,
    setStatus,
}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [openDelete, setOpenDelete] = React.useState(false);
    const handleOpenDelete = () => setOpenDelete(true);
    const handleCloseDelete = () => setOpenDelete(false);

    const [openSolve, setOpenSolve] = React.useState(false);
    const handleOpenSolve = () => setOpenSolve(true);
    const handleCloseSolve = () => setOpenSolve(false);

    const [openUnSolve, setOpenUnSolve] = React.useState(false);
    const handleOpenUnSolve = () => setOpenUnSolve(true);
    const handleCloseUnSolve = () => setOpenUnSolve(false);

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

    if (isLoading) {
        return <PostSkeleton />;
    }

    const onClickRemove = async () => {
        try {
            await dispatch(removePost(id));
            handleCloseDelete();
            navigate('/');
        } catch (err) {
            console.warn(err);
        }
    };

    const onClickSolve = async () => {
        try {
            const payload = { status: 1 };
            await dispatch(editPost({ id, payload }));
            handleCloseSolve();
            if (setStatus) {
                setStatus();
            }
        } catch (err) {
            console.warn(err);
        }
    }

    const onClickUnSolve = async () => {
        try {
            const payload = { status: 0 };
            await dispatch(editPost({ id, payload }));
            handleCloseUnSolve();
            if (setStatus) {
                setStatus();
            }
        } catch (err) {
            console.warn(err);
        }
    }

    const handleCreateLike = async (type) => {
        try {
            const payload = { type };
            const data = await dispatch(createPostLike({ id, payload }));
            if (data.meta.requestStatus === "fulfilled") {
                handleOpenSnack(data.payload.message);
                if (setLike) setLike(data.payload.count);
            } else {
                handleDeleteLike();
            }

        } catch (err) {
            console.warn(err);
        }
    }

    const handleDeleteLike = async () => {
        try {
            const data = await dispatch(deletePostLike(id));
            handleOpenSnack(data.payload.message);
            if (setLike) setLike(data.payload.count);
        } catch (err) {
            console.warn(err);
        }
    }

    return (
        <Card className={clsx(styles.root, { [styles.rootFull]: isFullPost })}>
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

            {isEditable && (
                <div className={styles.editButtons}>
                    {!status ?
                        <IconButton onClick={handleOpenSolve} color='success'>
                            <DoneRoundedIcon />
                        </IconButton> :
                        <IconButton onClick={handleOpenUnSolve} color='success'>
                            <ReplayRoundedIcon />
                        </IconButton>
                    }
                    <Link to={`/posts/${id}/edit`}>
                        <IconButton color='primary'>
                            <EditIcon />
                        </IconButton>
                    </Link>
                    <IconButton onClick={handleOpenDelete} color='secondary'>
                        <DeleteIcon />
                    </IconButton>


                    <ModalWindow
                        title='Confirm post solution'
                        content='Are you sure you want to mark this post as solved?'
                        action={onClickSolve}
                        open={openSolve}
                        handleClose={handleCloseSolve}
                    />

                    <ModalWindow
                        title='Cancel post solution'
                        content='Are you sure you want to mark this post as unsolved?'
                        action={onClickUnSolve}
                        open={openUnSolve}
                        handleClose={handleCloseUnSolve}
                    />

                    <ModalWindow
                        title='Confirm post deletion'
                        content='Are you sure you want to delete this post?'
                        action={onClickRemove}
                        open={openDelete}
                        handleClose={handleCloseDelete}
                    />
                </div>
            )}
            <div className={styles.wrapper}>
                <UserInfo
                    login={login}
                    avatar={avatar}
                    full_name={full_name}
                    author_id={author_id}
                    publish_date={publish_date}
                />

                <div className={styles.indention}>
                    <h2 className={clsx(styles.title, { [styles.titleFull]: isFullPost })}>
                        {isFullPost ? title : <Link to={`/posts/${id}`}>{title}</Link>}
                        {status ? <span style={{ color: 'rgba(0, 0, 0, 0.4)' }}> [solved]<DoneRoundedIcon /></span> : ''}
                    </h2>

                    <ul className={styles.categories}>
                        {categories.categories_titles.map((category, index) => (
                            <li key={categories.categories_id[index]}>
                                <Link to={`/categories/${categories.categories_id[index]}/posts`}>#{category}</Link>
                            </li>
                        ))}
                    </ul>

                    {children && <div className={styles.content}>{children}</div>}

                    {images && (
                        <div className={styles.imagesPreview}>
                            {images.map((image) =>
                                <div className={styles.imagePreview}>
                                    <ModalImage
                                        style={{ width: '120px', height: '120px' }}
                                        hideZoom={false}
                                        showRotate={true}
                                        small={`http://localhost:3001/posts/${image}`}
                                        large={`http://localhost:3001/posts/${image}`}
                                        alt={image}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                    
                    <ul className={styles.postDetails}>
                        <li>
                            <IconButton style={{ marginLeft: -7 }} onClick={handleCreateLike.bind(this, 1)} color='success'>
                                <ThumbUpIcon className={styles.like} />
                            </IconButton>
                            <span>{likesCount}</span>
                            <IconButton onClick={handleCreateLike.bind(this, 0)} color='error'>
                                <ThumbDownIcon className={styles.dislike} />
                            </IconButton>
                        </li>

                        <li>
                            <CommentIcon style={{ marginRight: 10, marginLeft: 10 }} />
                            <span>{commentsCount}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </Card>
    );
};
