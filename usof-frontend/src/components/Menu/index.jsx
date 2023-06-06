import React from 'react';
import { Link } from 'react-router-dom';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

import PersonIcon from '@mui/icons-material/Person';
import TagIcon from '@mui/icons-material/Tag';
import ArticleIcon from '@mui/icons-material/Article';

import { SideBlock } from '../index';

export const Menu = ({ isLoading = true }) => {
    return (
        <SideBlock title='Home'>
            <List sx={{ p: '0' }}>
                <Link
                    style={{ textDecoration: 'none', color: 'black' }}
                    to={`/posts`}
                >
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ArticleIcon color="primary" style={{ marginRight: '10px' }} />
                            <ListItemText primaryTypographyProps={{ noWrap: true }} primary='Posts' />
                        </ListItemButton>
                    </ListItem>
                </Link>
                <Link
                    style={{ textDecoration: 'none', color: 'black' }}
                    to={`/categories`}
                >
                    <ListItem disablePadding>
                        <ListItemButton>
                            <TagIcon color="primary" style={{ marginRight: '10px' }} />
                            <ListItemText primaryTypographyProps={{ noWrap: true }} primary='Categories' />
                        </ListItemButton>
                    </ListItem>
                </Link>
                <Link
                    style={{ textDecoration: 'none', color: 'black' }}
                    to={`/users`}
                >
                    <ListItem disablePadding>
                        <ListItemButton>
                            <PersonIcon color="primary" style={{ marginRight: '10px' }} />
                            <ListItemText primaryTypographyProps={{ noWrap: true }} primary='Users' />
                        </ListItemButton>
                    </ListItem>
                </Link>
            </List>
        </SideBlock>
    );
};
