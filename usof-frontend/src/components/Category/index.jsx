import React from 'react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';

import DeleteIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import ArticleIcon from '@mui/icons-material/Article';

import styles from './Category.module.scss';
import { CategorySkeleton } from './Skeleton';
import { ModalWindow } from '../ModalWindow';
import { removeCategory } from '../../redux/slices/categoriesSlice';

export const Category = ({
    id,
    title,
    description,
    postsCount,
    isEditable,
    isLoading,
    isFullPage,
}) => {
    const dispatch = useDispatch();

    const [openRemove, setOpenRemove] = React.useState(false);
    const handleOpenRemove = () => setOpenRemove(true);
    const handleCloseRemove = () => setOpenRemove(false);

    if (isLoading) {
        return <CategorySkeleton />;
    }

    const handleRemoveCategory = () => {
        try {
            dispatch(removeCategory(id));
            handleCloseRemove();
        } catch (err) {
            console.warn(err);
        }
    };

    return (
        <Card className={clsx(styles.root, { [styles.rootFull]: isFullPage })}>

            <ModalWindow
                title='Confirm category deletion'
                content='Are you sure you want to delete this category?'
                action={handleRemoveCategory}
                open={openRemove}
                handleClose={handleCloseRemove}
            />

            {isEditable && (
                <div className={styles.editButtons}>
                    <Link to={`/categories/${id}/edit`}>
                        <IconButton color='primary'>
                            <EditIcon />
                        </IconButton>
                    </Link>
                    <IconButton onClick={handleOpenRemove} color='secondary'>
                        <DeleteIcon />
                    </IconButton>
                </div>
            )}
            <div className={styles.wrapper}>
                <h2 className={clsx(styles.title, { [styles.titleFull]: isFullPage })}>
                    {isFullPage ? title : <Link to={`/categories/${id}/posts`}>{title}</Link>}
                </h2>

                <div className={styles.description}>{description}</div>

                <div className={styles.postDetails}>
                    <ArticleIcon color="primary" />
                    <span style={{ marginLeft: '5px' }}>{postsCount}</span>
                </div>
            </div>
        </Card>
    );
};
