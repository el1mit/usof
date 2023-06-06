import React from 'react';
import SimpleMDE from 'react-simplemde-editor';
import ModalImage from "react-modal-image";
import { useNavigate, Navigate, useParams } from 'react-router-dom';
import { TagsInput } from "react-tag-input-component";
import { useSelector } from 'react-redux';
import { selectIsAuth } from '../../redux/slices/authSlice.js'
import axios from '../../utils/axios';

import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

import { Menu } from '../../components';
import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';

export const AddPost = () => {
    const { id } = useParams();
    const inputImageRef = React.useRef(null);
    const isEditing = Boolean(id);
    const navigate = useNavigate();
    const isAuth = useSelector(selectIsAuth);
    const userData = useSelector((state) => state.auth.data);

    const [author, setAuthor] = React.useState('');
    const [title, setTitle] = React.useState('');
    const [content, setContent] = React.useState('');
    const [categories, setCategories] = React.useState([]);
    const [previewImages, setPreviewImages] = React.useState([]);
    const [uploadImages, setUploadImages] = React.useState([]);
    const [loadedImages, setLoadedImages] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const postData = await axios.get(`/posts/${id}`);
                setAuthor(postData.data.author_id);
                setTitle(postData.data.title);
                setContent(postData.data.content);

                postData.data.content_image.forEach((image) => {
                    setPreviewImages((prevState) => [...prevState, `http://localhost:3001/posts/${image}`]);
                    setUploadImages((prevState) => [...prevState, { name: image }]);
                    setLoadedImages((prevState) => [...prevState, { name: image }]);
                });

                const categoriesData = await axios.get(`/posts/${id}/categories`);
                setCategories(categoriesData.data.categories_titles);

            } catch (error) {
                console.error(error.message);
            }
        }

        if (id) {
            fetchData();
            setIsLoading(false);
        } else {
            setTitle('');
            setContent('');
            setCategories([]);
            setPreviewImages([]);
            setUploadImages([]);
            setLoadedImages([]);
            setIsLoading(false);
        }
    }, [id]);

    const onChange = React.useCallback((value) => {
        setContent(value);
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

    const handleUploadFiles = (event) => {
        try {
            for (let i = 0; i < event.target.files.length; i++) {
                setPreviewImages((prevState) => ([...prevState, URL.createObjectURL(event.target.files[i])]))
                setUploadImages((prevState) => ([...prevState, (event.target.files[i])]))
            }
        } catch (error) {
            console.warn(error);
        }
    }

    const onClickRemoveImage = (event) => {
        const imgSrc = event.target.parentElement.children[0].children[0].src;
        const imgAlt = event.target.parentElement.children[0].children[0].alt;

        setPreviewImages((prevState) => ([...prevState.filter(file => file !== imgSrc)]));
        setUploadImages((prevState) => ([...prevState.filter(file => file.name !== imgAlt)]));
    };


    const sendData = async () => {
        try {
            const formData = new FormData();
            for (let i = 0; i < uploadImages.length; i++) {
                const image = uploadImages[i];
                if (loadedImages.indexOf(image.name) === -1) {
                    formData.append('images', image);  
                } 
                formData.append('imageNames', image.name);            
            }

            const payload = {
                title,
                content,
                categories,
            };

            console.log(formData.getAll('images'));
            console.log(formData.getAll('imageNames'));

            const { data } = isEditing
                ? await axios.patch(`/posts/${id}`, payload)
                : await axios.post('/posts', payload);

            const newId = isEditing ? id : data.id;
            
            if (uploadImages.length > 0 || loadedImages.at.length > 0) {
                await axios.patch(`/posts/${newId}/images`, formData);
            }

            navigate(`/posts/${newId}`);
        } catch (err) {
            console.warn(err);
        }
    };

    const validateTag = (tag, existingTags) => {
        const index = existingTags.findIndex((element) => {
            return element.toLowerCase() === tag.trim().toLowerCase();
        });
        return index >= 0 ? false : true;
    }

    const changeCategories = (values) => {
        values.forEach((value, index) => {
            values[index] = value.trim();
        });
        setCategories(values);
    };

    if (!isLoading && userData && author) {
        if (((!window.localStorage.getItem('token') && !isAuth)
            || ((userData.id !== author) && !userData.admin))) {
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
                            placeholder='Post title...'
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            fullWidth
                        />

                        <TagsInput
                            classNames={{ tags: styles.tags, input: styles.tagsInput }}
                            value={categories}
                            onChange={changeCategories}
                            isEditOnRemove={true}
                            beforeAddValidate={validateTag}
                            name='Categories'
                            separators={[' ', 'Enter', ',']}
                            placeHolder="Enter categories (js, css, react, etc). Use space, enter or comma as delimiters."
                        />

                        <Button onClick={() => inputImageRef.current.click()} sx={{ mt: '20px' }} variant='outlined' size='large'>
                            Upload images
                        </Button>
                        <input ref={inputImageRef} onChange={handleUploadFiles} accept='image/*' multiple={true} type='file' hidden />

                        <div className={styles.imagesPreview}>
                            {previewImages?.map((preview, index) =>
                                preview && (
                                    <div className={styles.imagePreview}>
                                        <ModalImage
                                            style={{ width: '120px', height: '120px' }}
                                            hideZoom={false}
                                            showRotate={true}
                                            small={preview}
                                            large={preview}
                                            alt={uploadImages[index]?.name}
                                        />
                                        <Button onClick={onClickRemoveImage} variant='contained' color='error'>
                                            Delete
                                        </Button>
                                    </div>
                                ))}
                        </div>

                        <SimpleMDE className={styles.editor} value={content} onChange={onChange} options={options} />
                        <div className={styles.buttons}>
                            <Button onClick={sendData} size='large' variant='contained'>
                                {isEditing ? 'Edit post' : 'Create new post'}
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
