import React from 'react';

import Skeleton from '@mui/material/Skeleton';
import Card from '@mui/material/Card';

import styles from './Category.module.scss';

export const CategorySkeleton = () => {
    return (
        <Card className={styles.skeleton}>
            <div className={styles.skeletonContent}>
                <div className={styles.skeletonTitle}>
                    <Skeleton variant='text' width='20%' height={45} />
                </div>

                <div className={styles.skeletonInfo}>
                    <Skeleton variant='text' width='80%' height={25} />
                    <div className={styles.skeletonAdditional}>
                        <Skeleton variant='text' width='10%' height={30} />
                    </div>
                </div>
            </div>
        </Card>


    );
};