import React from 'react'

import { User } from '../index';
import styles from './Users.module.scss'

export const Users = ({ users, isUsersLoading, userData }) => {
    return (
        <div className={styles.usersWrapper}>
            {(isUsersLoading ? [...Array(20)] : users).map((obj, index) =>
                isUsersLoading ? (
                    <User key={index} isLoading={true} />
                ) : (
                    <User
                        key={index}
                        id={obj.id}
                        login={obj.login}
                        avatar={obj.avatar}
                        rating={obj.rating}
                        userData={userData}
                        admin={obj.role === 'ADMIN'}
                        isFullPage={false}
                    />
                )
            )}
        </div>
    );
};
