import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

export const getUsers = createAsyncThunk('users/getUsers', async () => {
    const { data } = await axios.get('/users');
    return data;
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
    users: [],
    message: '',
    status: 'loading',
}

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        usersSorting: (state, action) => {
            state.users.sort(dynamicSort(action.payload));
        },
    },
    extraReducers: {
        //getUsers
        [getUsers.pending]: (state, action) => {
            state.status = 'loading';
        },
        [getUsers.fulfilled]: (state, action) => {
            state.status = 'loaded';
            state.users = action.payload;
        },
        [getUsers.rejected]: (state, action) => {
            state.status = 'error';
            state.categories = null;
        },
        // //removePost
        // [removeCategory.pending]: (state, action) => {
        //     state.status = 'pending';
        //     state.categories = state.categories.filter(obj => obj.id !== action.meta.arg);
        // },
        // [removeCategory.fulfilled]: (state, action) => {
        //     state.message = action.payload.message;
        //     state.status = 'fullfilled';
        // },
        // [removeCategory.rejected]: (state, action) => {
        //     state.message = action.payload.message;
        //     state.status = 'error';
        // },
        // //editPost
        // [editCategory.pending]: (state, action) => {
        //     state.status = 'loading';
        //     state.categories = state.posts.map((post) => {
        //         if (post.id === action.meta.arg.id) {
        //             post = { ...post, ...action.meta.arg.params };
        //         }
        //         return post;
        //     });
        // },
        // [editCategory.fulfilled]: (state, action) => {
        //     state.message = action.payload.message;
        //     state.status = 'loaded';
        // },
        // [editCategory.rejected]: (state, action) => {
        //     state.message = action.payload.message;
        //     state.status = 'error';
        // },
    }
});

export const usersReducer = usersSlice.reducer;
export const { usersSorting } = usersSlice.actions;
