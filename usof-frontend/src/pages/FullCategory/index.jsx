import React from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCategoryPosts, postsSorting } from '../../redux/slices/postsSlice';
import axios from '../../utils/axios';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Pagination from '@mui/material/Pagination';
import Grid from '@mui/material/Grid';

import { Posts, Menu } from '../../components';
import { Category } from '../../components/Category';

export const FullCategory = ({ search }) => {
    const dispatch = useDispatch();

    const userData = useSelector((state) => state.auth.data);
    const { posts } = useSelector((state) => state.posts);

    const [category, setCategory] = React.useState();
    const [isLoading, setIsLoading] = React.useState(true);
    const [tab, setTab] = React.useState(0);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [postsPerPage] = React.useState(10);

    const { id } = useParams();

    React.useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const categoryData = await axios.get(`/categories/${id}`);
                setCategory(categoryData.data);

                dispatch(getCategoryPosts(id))
            } catch (error) {
                console.error(error.message);
            }
            setIsLoading(false);
        }

        fetchData();

    }, [id]);

    if (isLoading) {
        return <Posts isPostsLoading={setIsLoading} />
    }

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
                    <Category
                        id={category.id}
                        title={`Posts in Category "${category.title}"`}
                        description={category.description || ''}
                        postsCount={category.posts_count}
                        isEditable={userData?.admin}
                        isFullPage={true}
                    />

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

