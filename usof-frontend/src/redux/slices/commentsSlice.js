import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

export const createComment = createAsyncThunk('comments/createComment', async (params) => {
    const { data } = await axios.post(`/posts/${params.postId}/comments`, params.payload);
    return data;
});

export const editComment = createAsyncThunk('comments/editComment', async (params) => {
    const { data } = await axios.patch(`/comments/${params.id}`, params.payload);
    return data;
});

export const deleteComment = createAsyncThunk('comments/deleteComment', async (id) => {
    const { data } = await axios.delete(`/comments/${id}`);
    return data;
});

export const getPostComments = createAsyncThunk('comments/getPostComments', async (id) => {
    let { data } = await axios.get(`/posts/${id}/comments`);

    for (let i = 0; i < data.length; i++) {
        let likes = await axios.get(`/comments/${data[i].id}/like`);
        data[i].likes = likes.data;
    }

    return data;
});

export const createCommentLike = createAsyncThunk('comments/createCommentLike', async (params) => {
    try {
        const { data } = await axios.post(`/comments/${params.id}/like`, params.payload);
        return data;
    } catch (error) {
        const customError = {
            statusText: error.response.statusText,
            message: error.response.data.message,
        };
        throw customError;
    }
});

export const deleteCommentLike = createAsyncThunk('comments/deleteCommentLike', async (id) => {
    try {
        const { data } = await axios.delete(`/comments/${id}/like`);
        return data;
    } catch (error) {
        const customError = {
            statusText: error.response.statusText,
            message: error.response.data.message,
        };
        throw customError;
    }
});


const initialState = {
    comments: [],
    message: '',
    status: 'loading',
}

const commentsSlice = createSlice({
    name: 'comments',
    initialState,
    extraReducers: {
        //getPostComments
        [getPostComments.pending]: (state, action) => {
            state.status = 'loading';
        },
        [getPostComments.fulfilled]: (state, action) => {
            state.status = 'loaded';
            state.comments = action.payload;
        },
        [getPostComments.rejected]: (state, action) => {
            state.status = 'error';
            state.comments = null;
        },
        //createComment
        [createComment.pending]: (state, action) => {
            state.status = 'loading';
        },
        [createComment.fulfilled]: (state, action) => {
            state.status = 'loaded';
            state.comments.push({
                ...action.payload,
                login: action.meta.arg.login,
                avatar: action.meta.arg.avatar,
                rating: action.meta.arg.rating,
                likes: {
                    comment_id: action.payload.id,
                    likes_count: 0,
                    dislikes_count: 0,
                    count: 0,
                }
            });
        },
        [createComment.rejected]: (state, action) => {
            state.status = 'error';
        },
        //editComment
        [editComment.pending]: (state, action) => {
            state.status = 'loading';
        },
        [editComment.fulfilled]: (state, action) => {
            state.status = 'loaded';
            state.message = action.payload.message;
            state.comments = state.comments.map((comment) => {
                if (comment.id === action.meta.arg.id) {
                    comment.content = action.meta.arg.payload.content;
                }
                return comment;
            });

        },
        [editComment.rejected]: (state, action) => {
            state.status = 'error';
        },
        //deleteComment
        [deleteComment.pending]: (state, action) => {
            state.status = 'loading';
        },
        [deleteComment.fulfilled]: (state, action) => {
            state.status = 'loaded';
            state.message = action.payload.message;
            state.comments = state.comments.filter(obj => obj.id !== action.meta.arg);
        },
        [deleteComment.rejected]: (state, action) => {
            state.status = 'error';
        },
        //createCommentLike
        [createCommentLike.pending]: (state, action) => {
            state.status = 'loading';
        },
        [createCommentLike.fulfilled]: (state, action) => {
            state.status = 'loaded';
            state.message = action.payload.message;
            state.comments = state.comments.map((comment) => {
                if (comment.id === action.meta.arg.id) {
                    comment.likes.count += action.payload.count;
                }
                return comment;
            });
        },
        [createCommentLike.rejected]: (state, action) => {
            state.message = action.error.message;
            state.status = 'error';
        },
        //deleteCommentLike
        [deleteCommentLike.pending]: (state, action) => {
            state.status = 'loading';
        },
        [deleteCommentLike.fulfilled]: (state, action) => {
            state.status = 'loaded';
            state.comments = state.comments.map((comment) => {
                if (comment.id === action.meta.arg) {
                    comment.likes.count += action.payload.count;
                }
                return comment;
            });
            state.message = action.payload.message;
        },
        [deleteCommentLike.rejected]: (state, action) => {
            state.message = action.error.message;
            state.status = 'error';
        },
    }
});

export const commentsReducer = commentsSlice.reducer;
