import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import axios from '../../utils/axios';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import Pagination from '@mui/material/Pagination';

import { Menu, User, Posts } from '../../components'
import { getUserPosts, postsSorting } from '../../redux/slices/postsSlice';

export const UserProfile = ({ search }) => {
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.auth.data);
    const { posts } = useSelector((state) => state.posts)
    const [user, setUser] = React.useState();
    const [isLoading, setLoading] = React.useState(true);

    const [tab, setTab] = React.useState(0);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [postsPerPage] = React.useState(10);

    const { id } = useParams();

    React.useEffect(() => {

        const fetchData = async () => {
            setLoading(true);
            try {
                const user = await axios.get(`/users/${id}`);
                setUser(user.data);

                dispatch(getUserPosts(id));
            } catch (error) {
                console.error(error.message);
            }
            setLoading(false);
        }

        fetchData();
    }, [id]);


    const handleSort = (property) => {
        dispatch(postsSorting(property));
    };

    const handleTab = (event, newValue) => {
        setTab(newValue);
    };

    const paginate = (event, page) => {
        setCurrentPage(page);
    };

    const filteredPosts = posts.filter(post => {
        if ((post.categories.categories_titles.findIndex((item) =>
            item.toLowerCase().includes(search.toLowerCase()))) > -1) {
            return post;
        }
        return post.title.toLowerCase().includes(search.toLowerCase())
            || post.login.toLowerCase().includes(search.toLowerCase())
    });

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

    return (
        <>
            <Grid container spacing={4}>
                <Grid item lg={2}>
                    <Menu isLoading={false} />
                </Grid>
                <Grid item lg={10}>
                    {!isLoading && (
                        <User
                            id={user.id}
                            login={user.login}
                            avatar={user.avatar}
                            rating={user.rating}
                            full_name={user.full_name}
                            userData={userData}
                            role={user.role}
                            admin={user.role === 'ADMIN'}
                            isFullPage={true}
                        />
                    )}

                    <Tabs sx={{ mb: '15px', mt: '-12px' }} value={tab} onChange={handleTab} variant="fullWidth">
                        <Tab label='New' onClick={handleSort.bind(this, '-publish_date')} />
                        <Tab label='Old' onClick={handleSort.bind(this, 'publish_date')} />
                        <Tab label='Name (A - Z)' onClick={handleSort.bind(this, 'title')} />
                        <Tab label='Name (Z - A)' onClick={handleSort.bind(this, '-title')} />
                        <Tab label='Most Likes' onClick={handleSort.bind(this, '-likes.count')} />
                        <Tab label='Least Likes' onClick={handleSort.bind(this, 'likes.count')} />
                        <Tab label='Most Comments' onClick={handleSort.bind(this, '-comments.count')} />
                        <Tab label='Least Comments' onClick={handleSort.bind(this, 'comments.count')} />
                    </Tabs>

                    <Posts posts={currentPosts} isPostsLoading={isLoading} userData={userData}></Posts>
                    
                    <Pagination
                        sx={{ display: 'flex', justifyContent: 'center', mb: '20px' }}
                        count={Math.ceil(filteredPosts.length / postsPerPage)}
                        onChange={paginate}
                        showFirstButton
                        showLastButton
                    />
                </Grid>
            </Grid>
        </>
    );

};
