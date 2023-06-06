import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getMe, selectIsAuth } from './redux/slices/authSlice';

import Container from '@mui/material/Container';

import { Header } from './components';
import {
    Home, AllPosts, AllCategories, AllUsers, FullPost, Registration, AddCategory,
    EditUser, AddPost, Login, UserProfile, RegistrationSuccessful, FullCategory
} from './pages';


function App() {
    const dispatch = useDispatch();
    let [search, setSearch] = React.useState('');

    React.useEffect(() => {
        dispatch(getMe());
    }, [dispatch]);

    const handleSearch = (value) => {
        setSearch(value);
    }

    return (
        <>
            <Header handleSearch={handleSearch} />
            <Container>
                <Routes>
                    <Route path='/' element={<Home />} />

                    <Route path='/posts' element={<AllPosts search={search} />} />
                    <Route path='/new-post' element={<AddPost />} />
                    <Route path='/posts/:id' element={<FullPost />} />
                    <Route path='/posts/:id/edit' element={<AddPost />} />

                    <Route path='/categories' element={<AllCategories search={search} />} />
                    <Route path='/new-category' element={<AddCategory />} />
                    <Route path='/categories/:id/edit' element={<AddCategory />} />
                    <Route path='/categories/:id/posts' element={<FullCategory search={search} />} />

                    <Route path='/users' element={<AllUsers search={search} />} />
                    <Route path='/users/:id' element={<UserProfile search={search} />} />
                    <Route path='/users/:id/edit' element={<EditUser search={search} />} />

                    <Route path='/login' element={<Login />} />
                    <Route path='/register' element={<Registration />} />
                    <Route path='/registered' element={<RegistrationSuccessful />} />
                </Routes>
            </Container>
        </>
    );
}

export default App;
