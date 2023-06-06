import React from 'react';

import Skeleton from '@mui/material/Skeleton';
import Card from '@mui/material/Card';

import styles from './User.module.scss';

export const UserSkeleton = () => {
    return (
        <Card className={styles.skeleton}>
            <div className={styles.skeletonContent}>
                <div className={styles.skeletonAvatar}>
                    <Skeleton variant='circular' width={50} height={50} />
                </div>

                <div className={styles.skeletonLogin}>
                    <Skeleton variant='text'  height={25} />
                    
                </div>

                <div className={styles.skeletonRating}>
                    <Skeleton variant='text' height={30} />
                </div>
            </div>
        </Card>


    );
};