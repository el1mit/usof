import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPosts, postsSorting } from '../../redux/slices/postsSlice';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';

import Pagination from '@mui/material/Pagination';

import { Posts, Menu } from '../../components';

export const AllPosts = ({ search }) => {
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.auth.data);
    const { posts } = useSelector((state) => state.posts);
    const isPostsLoading = posts.status === 'loading';

    const [tab, setTab] = React.useState(0);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [postsPerPage] = React.useState(10);

    React.useEffect(() => {
        dispatch(getPosts());
    }, []);

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
                <Grid lg={2} item>
                    <Menu isLoading={false} />
                </Grid>

                <Grid lg={10} item>
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

                    <Posts posts={currentPosts} isPostsLoading={isPostsLoading} userData={userData}></Posts>
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
