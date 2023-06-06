import { configureStore } from '@reduxjs/toolkit';
import { postsReducer } from './slices/postsSlice';
import { categoriesReducer } from './slices/categoriesSlice';
import { commentsReducer } from './slices/commentsSlice';
import { usersReducer } from './slices/usersSlice';
import { authReducer } from './slices/authSlice';


const store = configureStore({
    reducer: {
        posts: postsReducer,
        categories: categoriesReducer,
        comments: commentsReducer,
        users: usersReducer,
        auth: authReducer,
    }
});

export default store;
