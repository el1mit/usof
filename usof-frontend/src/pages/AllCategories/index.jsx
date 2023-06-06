import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCategories, categoriesSorting } from '../../redux/slices/categoriesSlice';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';

import Pagination from '@mui/material/Pagination';

import { Categories, Menu } from '../../components';

export const AllCategories = ({ search }) => {
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.auth.data);
    const { categories } = useSelector((state) => state.categories);
    const isCategoriesLoading = categories.status === 'loading';

    const [tab, setTab] = React.useState(0);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [categoriesPerPage] = React.useState(12);

    React.useEffect(() => {
        dispatch(getCategories());
    }, []);

    const handleSort = (property) => {
        dispatch(categoriesSorting(property));
    };

    const handleTab = (event, newValue) => {
        setTab(newValue);
    };

    const paginate = (event, page) => {
        setCurrentPage(page);
    };

    const filteredCategories = categories.filter(category => {
        return category.title.toLowerCase().includes(search.toLowerCase())
            || category.description.toLowerCase().includes(search.toLowerCase())
    });

    const indexOfLastCategory = currentPage * categoriesPerPage;
    const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
    const currentCategories = filteredCategories.slice(indexOfFirstCategory, indexOfLastCategory);

    return (
        <>
            <Grid container spacing={4}>
                <Grid item lg={2}>
                    <Menu isLoading={false} />
                </Grid>
                <Grid item lg={10}>
                    <Tabs sx={{ mb: '15px', mt: '-12px' }} value={tab} onChange={handleTab} variant="fullWidth">
                        <Tab label='Name (A - Z)' onClick={handleSort.bind(this, 'title')} />
                        <Tab label='Name (Z - A)' onClick={handleSort.bind(this, '-title')} />
                        <Tab label='Most Posts' onClick={handleSort.bind(this, '-posts_count')} />
                        <Tab label='Least Posts' onClick={handleSort.bind(this, 'posts_count')} />
                    </Tabs>

                    <Categories categories={currentCategories} isPostsLoading={isCategoriesLoading} userData={userData}></Categories>
                    <Pagination
                        sx={{ display: 'flex', justifyContent: 'center', mb: '20px' }}
                        count={Math.ceil(filteredCategories.length / categoriesPerPage)}
                        onChange={paginate}
                        showFirstButton
                        showLastButton
                    />
                </Grid>
            </Grid>
        </>
    );
};
