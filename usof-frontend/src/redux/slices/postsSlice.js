import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

export const getPosts = createAsyncThunk('posts/getPosts', async () => {
    const { data } = await axios.get('/posts');
    return data;
});

export const getUserPosts = createAsyncThunk('posts/getUserPosts', async (id) => {
    const { data } = await axios.get(`/users/${id}/posts`);
    return data;
});

export const getCategoryPosts = createAsyncThunk('posts/getCategoryPosts', async (id) => {
    const { data } = await axios.get(`/categories/${id}/posts`);
    
    for (let i = 0; i < data.length; i++) {
        let posts = await axios.get(`/posts/${data[i].post_id}`);
        let likes = await axios.get(`/posts/${data[i].post_id}/like`);
        let categories = await axios.get(`/posts/${data[i].post_id}/categories`);
        data[i] = posts.data;
        data[i].likes = likes.data;
        data[i].categories = categories.data;
    }
    
    return data;
});

export const removePost = createAsyncThunk('posts/removePost', async (id) => {
    const { data } = await axios.delete(`/posts/${id}`);
    return data;
});

export const editPost = createAsyncThunk('posts/editPost', async (params) => {
    const { data } = await axios.patch(`/posts/${params.id}`, params.payload);
    return data;
});

export const createPostLike = createAsyncThunk('posts/createPostLike', async (params) => {
    try {
        const { data } = await axios.post(`/posts/${params.id}/like`, params.payload);
        return data;
    } catch (error) {
        const customError = {
            statusText: error.response.statusText,
            message: error.response.data.message,
        };
        throw customError;
    }
});

export const deletePostLike = createAsyncThunk('posts/deletePostLike', async (id) => {
    try {
        const { data } = await axios.delete(`/posts/${id}/like`);
        return data;
    } catch (error) {
        const customError = {
            statusText: error.response.statusText,
            message: error.response.data.message,
        };
        throw customError;
    }
});

const dynamicSort = (property) => {
    let sortOrder = 1;
    if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    property = property.split('.')

    return function (a, b) {
        if (property.length === 1) {
            if (typeof (a[property[0]]) === 'string') {
                let result = (a[property[0]].toLowerCase() < b[property[0]].toLowerCase()) ? -1
                    : (a[property[0]].toLowerCase() > b[property[0]].toLowerCase()) ? 1 : 0;
                return result * sortOrder;
            }

            let result = (a[property[0]] < b[property[0]]) ? -1
                : (a[property[0]] > b[property[0]]) ? 1 : 0;
            return result * sortOrder;
        }
        if (property.length === 2) {
            let result = (a[property[0]][property[1]] < b[property[0]][property[1]]) ? -1
                : (a[property[0]][property[1]] > b[property[0]][property[1]]) ? 1 : 0;
            return result * sortOrder;
        }
    }
}

const initialState = {
    posts: [],
    message: '',
    status: 'loading',
}

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        postsSorting: (state, action) => {
            state.posts.sort(dynamicSort(action.payload));
        },
    },
    extraReducers: {
        //getPosts
        [getPosts.pending]: (state, action) => {
            state.status = 'loading';
        },
        [getPosts.fulfilled]: (state, action) => {
            state.status = 'loaded';
            state.posts = action.payload;
        },
        [getPosts.rejected]: (state, action) => {
            state.status = 'error';
            state.posts = null;
        },
        //getUserPosts
        [getUserPosts.pending]: (state, action) => {
            state.status = 'loading';
        },
        [getUserPosts.fulfilled]: (state, action) => {
            state.status = 'loaded';
            state.posts = action.payload;
        },
        [getUserPosts.rejected]: (state, action) => {
            state.status = 'error';
            state.posts = null;
        },
        //getCategoryPosts
        [getCategoryPosts.pending]: (state, action) => {
            state.status = 'loading';
        },
        [getCategoryPosts.fulfilled]: (state, action) => {
            state.status = 'loaded';
            state.posts = action.payload;
        },
        [getCategoryPosts.rejected]: (state, action) => {
            state.status = 'error';
            state.posts = null;
        },
        //removePost
        [removePost.pending]: (state, action) => {
            state.status = 'pending';
            state.posts = state.posts.filter(obj => obj.id !== action.meta.arg);
        },
        [removePost.fulfilled]: (state, action) => {
            state.status = 'fullfilled';
        },
        [removePost.rejected]: (state, action) => {
            state.status = 'error';
        },
        //editPost
        [editPost.pending]: (state, action) => {
            state.status = 'loading';
            state.posts = state.posts.map((post) => {
                if (post.id === action.meta.arg.id) {
                    post = { ...post, ...action.meta.arg.payload };
                }
                return post;
            });
        },
        [editPost.fulfilled]: (state, action) => {
            state.status = 'loaded';
        },
        [editPost.rejected]: (state, action) => {
            state.status = 'error';
        },
        //createPostLike
        [createPostLike.pending]: (state, action) => {
            state.status = 'loading';
        },
        [createPostLike.fulfilled]: (state, action) => {
            state.status = 'loaded';
            state.message = action.payload.message;
            state.posts = state.posts.map((post) => {
                if (post.id === action.meta.arg.id) {
                    post.likes.count += action.payload.count;
                }
                return post;
            });
        },
        [createPostLike.rejected]: (state, action) => {
            state.message = action.error.message;
            state.status = 'error';
        },
        //deletePostLike
        [deletePostLike.pending]: (state, action) => {
            state.status = 'loading';
        },
        [deletePostLike.fulfilled]: (state, action) => {
            state.status = 'loaded';
            state.posts = state.posts.map((post) => {
                if (post.id === action.meta.arg) {
                    post.likes.count += action.payload.count;
                }
                return post;
            });
            state.message = action.payload.message;
        },
        [deletePostLike.rejected]: (state, action) => {
            state.message = action.error.message;
            state.status = 'error';
        },
    }
});

export const postsReducer = postsSlice.reducer;
export const { postsSorting } = postsSlice.actions;