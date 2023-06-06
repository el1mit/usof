import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPosts } from '../../redux/slices/postsSlice';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import { Posts, Menu } from '../../components';

export const Home = () => {
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.auth.data);
    let { posts } = useSelector((state) => state.posts);
    const isPostsLoading = posts.status === 'loading';
    const [postsCount, setPostsCount] = React.useState(10);

    React.useEffect(() => {
        dispatch(getPosts());
    }, []);

    const handleSelect = (event) => {
        setPostsCount(event.target.value);
    };

    posts = posts.slice(0, postsCount);

    return (
        <>
            <Grid container spacing={4}>
                <Grid lg={2} item>
                    <Menu isLoading={false} />
                </Grid>

                <Grid lg={10} item>
                    <Typography variant='h4' mb={1} ml={1} fontWeight={600} >Last Posts</Typography>

                    <FormControl sx={{ mb: '20px' }} fullWidth>
                        <InputLabel>Select count of posts to show</InputLabel>
                        <Select
                            value={postsCount}
                            label="Select count of posts to show"
                            onChange={handleSelect}
                        >
                            <MenuItem value={5}>Five (5)</MenuItem>
                            <MenuItem value={10}>Ten (10) - Default</MenuItem>
                            <MenuItem value={20}>Twenty (20)</MenuItem>
                            <MenuItem value={30}>Thirty (30)</MenuItem>
                            <MenuItem value={40}>Fourty (40)</MenuItem>
                            <MenuItem value={50}>Fifty (50)</MenuItem>
                        </Select>
                    </FormControl>

                    <Posts posts={posts} isPostsLoading={isPostsLoading} userData={userData}/>
                </Grid>
            </Grid>
        </>
    );
};
