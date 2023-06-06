import React from 'react';
import { useDispatch } from 'react-redux';
import axios from '../../utils/axios';
import SimpleMDE from 'react-simplemde-editor';

import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';

import styles from './AddComment.module.scss';
import { createComment, editComment } from '../../redux/slices/commentsSlice';

export const AddComment = ({ postId, userData, isEditing }) => {
    const dispatch = useDispatch();
    const [content, setContent] = React.useState('');

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get(`/comments/${isEditing.id}`);
                setContent(data.content);
            } catch (error) {
                console.error(error.message);
            }
        }

        if (isEditing.edit) {
            fetchData();
        } else {
            setContent('');
        }

    }, [isEditing]);

    const sendComment = () => {
        const payload = { content };
        if (isEditing.edit) {
            dispatch(editComment({
                id: isEditing.id,
                payload,
            }));
            isEditing.edit = false;
            setContent('');
        } else {
            dispatch(createComment({
                postId,
                payload,
                login: userData.login,
                avatar: userData.avatar,
                rating: userData.rating
            }));
            setContent('');
        }

    };

    const onChange = React.useCallback((value) => {
        setContent(value);
    }, []);

    const options = React.useMemo(
        () => ({
            spellChecker: false,
            maxHeight: '100px',
            autofocus: true,
            placeholder: 'Write comment...',
            status: false,
            autosave: {
                enabled: true,
                delay: 1000,
            },
        }),
        [],
    );


    return (
        <>
            <div className={styles.root}>
                <Avatar
                    classes={{ root: styles.avatar }}
                    src={`http://localhost:3001/avatar/${userData?.avatar}`}
                />
                <div className={styles.form}>
                    <SimpleMDE value={content} onChange={onChange} options={options} />
                    <Button onClick={sendComment} variant='contained'>{isEditing.edit ? 'Edit' : 'Send'}</Button>
                </div>
            </div>
        </>
    );
};
