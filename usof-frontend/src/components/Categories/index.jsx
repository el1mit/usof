import React from 'react'

import { Category } from '../index';
import styles from './Categories.module.scss'

export const Categories = ({ categories, isCategoriesLoading, userData }) => {
    return (
        <div className={styles.categoriesWrapper}>
            {(isCategoriesLoading ? [...Array(5)] : categories).map((obj, index) =>
                isCategoriesLoading ? (
                    <Category key={index} isLoading={true} />
                ) : (
                    <Category
                        key={index}
                        id={obj.id}
                        title={obj.title}
                        description={obj.description || ''}
                        postsCount={obj.posts_count}
                        isEditable={userData?.admin}
                    />
                )
            )}
        </div>
    );
};
