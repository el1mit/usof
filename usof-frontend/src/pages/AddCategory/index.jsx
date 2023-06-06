import React from 'react';
import SimpleMDE from 'react-simplemde-editor';
import { useNavigate, Navigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuth } from '../../redux/slices/authSlice.js'
import axios from '../../utils/axios';

import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

import { Menu } from '../../components';
import 'easymde/dist/easymde.min.css';
import styles from './AddCategory.module.scss';

export const AddCategory = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isAuth = useSelector(selectIsAuth);
    const userData = useSelector((state) => state.auth.data);
    const isEditing = Boolean(id);

    const [title, setTitle] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);

    React.useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const { data } = await axios.get(`/categories/${id}`);
                setTitle(data.title);
                setDescription(data.description);

            } catch (error) {
                console.error(error.message);
            }
            setIsLoading(false);
        }

        if (id) {
            fetchData();
        } else {
            setTitle('');
            setDescription('');
        }
    }, [id]);


    const onChange = React.useCallback((value) => {
        setDescription(value);
    }, []);

    const options = React.useMemo(
        () => ({
            spellChecker: false,
            maxHeight: '400px',
            autofocus: true,
            placeholder: 'Enter text...',
            status: false,
            autosave: {
                enabled: true,
                delay: 1000,
            },
        }),
        [],
    );

    const sendData = async () => {
        try {
            const payload = {
                title,
                description
            };

            const { data } = isEditing
                ? await axios.patch(`/categories/${id}`, payload)
                : await axios.post('/categories', payload);
            console.log(data);
            const newId = isEditing ? id : data.id;
            navigate(`/categories/${newId}/posts`);
        } catch (err) {
            console.warn(err);
        }
    };

    if (!isLoading && userData) {
        if (!window.localStorage.getItem('token') || !isAuth || !userData.admin) {
            return <Navigate to='/' />
        }
    }

    return (
        <>
            <Grid container spacing={4}>
                <Grid item lg={2}>
                    <Menu isLoading={false} />
                </Grid>
                <Grid item lg={10}>
                    <Paper elevation={3} sx={{ p: '30px', mb: '30px' }}>

                        <TextField
                            classes={{ root: styles.title }}
                            variant='standard'
                            placeholder='Category title...'
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            fullWidth
                        />

                        <SimpleMDE className={styles.editor} value={description} onChange={onChange} options={options} />
                        <div className={styles.buttons}>
                            <Button onClick={sendData} size='large' variant='contained'>
                                {isEditing ? 'Edit category' : 'Create new category'}
                            </Button>
                            <a href='/'>
                                <Button size='large'>Cancel</Button>
                            </a>
                        </div>
                    </Paper>
                </Grid>
            </Grid>
        </>



    );
};
