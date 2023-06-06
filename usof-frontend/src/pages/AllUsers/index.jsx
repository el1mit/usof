import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUsers, usersSorting } from '../../redux/slices/usersSlice';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import Pagination from '@mui/material/Pagination';

import { Users, Menu } from '../../components';

export const AllUsers = ({ search }) => {
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.auth.data);
    const { users } = useSelector((state) => state.users);
    const isUsersLoading = users.status === 'loading';

    const [tab, setTab] = React.useState(0);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [usersPerPage] = React.useState(20);

    React.useEffect(() => {
        dispatch(getUsers());
    }, []);

    const handleSort = (property) => {
        dispatch(usersSorting(property));
    };

    const handleTab = (event, newValue) => {
        setTab(newValue);
    };

    const paginate = (event, page) => {
        setCurrentPage(page);
    };

    const filteredUsers = users.filter(user => {
        return user.login.toLowerCase().includes(search.toLowerCase());
    });

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    return (
        <>
            <Grid container spacing={4}>
                <Grid lg={2} item>
                    <Menu isLoading={false} />
                </Grid>

                <Grid lg={10} item>
                    <Tabs sx={{ mb: '15px', mt: '-12px' }} value={tab} onChange={handleTab} variant="fullWidth">
                        <Tab label='New Users' onClick={handleSort.bind(this, '-id')} />
                        <Tab label='Old Users' onClick={handleSort.bind(this, 'id')} />
                        <Tab label='Name (A - Z)' onClick={handleSort.bind(this, 'login')} />
                        <Tab label='Name (Z - A)' onClick={handleSort.bind(this, '-login')} />
                        <Tab label='Highest Rating' onClick={handleSort.bind(this, '-rating')} />
                        <Tab label='Lowest Rating' onClick={handleSort.bind(this, 'rating')} />
                    </Tabs>

                    <Users users={currentUsers} isUsersLoading={isUsersLoading} userData={userData}></Users>

                    <Pagination
                        sx={{ display: 'flex', justifyContent: 'center', mb: '20px' }}
                        count={Math.ceil(filteredUsers.length / usersPerPage)}
                        onChange={paginate}
                        showFirstButton
                        showLastButton
                    />
                </Grid>
            </Grid>
        </>
    );
};
