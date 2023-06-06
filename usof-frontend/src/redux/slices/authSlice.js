import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

export const postLogin = createAsyncThunk('auth/postLogin', async (params) => {
    try {
        const { data } = await axios.post('/auth/login', params);
        return data;
    } catch (error) {
        const customError = {
            statusText: error.response.statusText,
            message: error.response.data.message,
        };
        throw customError;
    }
});

export const postRegister = createAsyncThunk('auth/postRegister', async (params) => {
    try {
        const { data } = await axios.post('/auth/register', params);
        return data;
    } catch (error) {
        const customError = {
            statusText: error.response.statusText,
            message: error.response.data.message,
        };
        throw customError;
    }
});

export const getMe = createAsyncThunk('auth/getMe', async () => {
    const { data } = await axios.get('/auth/me');
    return data;
});

const initialState = {
    data: null,
    token: null,
    status: 'loading'
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.data = null;
            state.status = 'loaded';
        }
    },
    extraReducers: {
        //postLogin
        [postLogin.pending]: (state, action) => {
            state.data = null;
            state.token = null;
            state.status = 'loading';
        },
        [postLogin.fulfilled]: (state, action) => {
            state.data = action.payload.user;
            state.token = action.payload.token;
            state.status = 'loaded';
        },
        [postLogin.rejected]: (state, action) => {
            state.data = null;
            state.token = null;
            state.status = 'error';
        },
        //getMe
        [getMe.pending]: (state, action) => {
            state.data = null;
            state.status = 'loading';
        },
        [getMe.fulfilled]: (state, action) => {
            state.data = action.payload;
            state.status = 'loaded';
        },
        [getMe.rejected]: (state, action) => {
            state.data = null;
            state.status = 'error';
        },
    },
})

export const selectIsAuth = (state) => Boolean(state.auth.data);
export const authReducer = authSlice.reducer;
export const { logout } = authSlice.actions;

