import React from 'react';
import ReactMarkdown from 'react-markdown';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getPostComments } from '../../redux/slices/commentsSlice';
import axios from '../../utils/axios';

import Grid from '@mui/material/Grid';

import { Post, AddComment, CommentsBlock, Menu } from '../../components';
import { getMe } from '../../redux/slices/authSlice';

export const FullPost = () => {
    const dispatch = useDispatch();

    const userData = useSelector((state) => state.auth.data);
    const comments = useSelector((state) => state.comments);

    const [post, setPost] = React.useState();
    const [categories, setCategories] = React.useState();
    const [likes, setLikes] = React.useState();
    const [editComment, setEditComment] = React.useState({ id: 0, edit: false });
    const [isLoading, setLoading] = React.useState(true);

    const { id } = useParams();

    React.useEffect(() => {
        dispatch(getMe());
        const fetchData = async () => {
            setLoading(true);
            try {
                const postData = await axios.get(`/posts/${id}`);
                setPost(postData.data);
                
                const likesData = await axios.get(`/posts/${id}/like`);
                setLikes(likesData.data);

                const categoriesData = await axios.get(`/posts/${id}/categories`);
                setCategories(categoriesData.data);

                dispatch(getPostComments(id))
            } catch (error) {
                console.error(error.message);
            }
            setLoading(false);
        }

        fetchData();
    }, [id]);

    if (isLoading) {
        return <Post isLoading={isLoading} />
    }

    const handleLike = (value) => {
        setLikes(previousState => {
            return { ...previousState, count: previousState.count += value }
        });
    }

    const handleStatus = () => {
        setPost(previousState => {
            return { ...previousState, status: !previousState.status }
        });
    }

    const handleCommentEdit = (comment_id) => {
        setEditComment(previousState => {
            return { id: comment_id, edit: !previousState.edit }
        });
    }
    
    return (
        <>
            <Grid container spacing={4}>
                <Grid item lg={2}>
                    <Menu isLoading={false} />
                </Grid>
                <Grid item lg={10}>
                    <Post
                        id={post.id}
                        author_id={post.author_id}
                        title={post.title}
                        avatar={`http://localhost:3001/avatar/${post.avatar}`}
                        login={post.login}
                        full_name={post.full_name}
                        publish_date={new Date(post.publish_date).toLocaleDateString()}
                        likesCount={likes.count}
                        commentsCount={comments.comments.length}
                        categories={categories}
                        images={post.content_image}
                        isEditable={(userData?.id === post.author_id) || userData?.admin}
                        status={post.status}
                        setLike={handleLike}
                        setStatus={handleStatus}
                    >
                        <ReactMarkdown children={post.content} />
                    </Post>
                    <CommentsBlock
                        items={comments.comments}
                        userData={userData}
                        isLoading={false}
                        setEditing={handleCommentEdit}
                    >
                        <AddComment postId={post.id} userData={userData} isEditing={editComment} />
                    </CommentsBlock>
                </Grid>
            </Grid>


        </>
    );
};
