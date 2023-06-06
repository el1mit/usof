import React from 'react';
import { Link } from 'react-router-dom';

import styles from './UserInfo.module.scss';
import ThumbsUpDownIcon from '@mui/icons-material/ThumbsUpDown';

export const UserInfo = ({ login, author_id, avatar, full_name, rating, role, publish_date }) => {
    return (
        <div className={styles.root}>
            <img className={styles.avatar} src={avatar} alt={full_name} />
            <div className={styles.userDetails}>
                <Link to={`/users/${author_id}`} className={styles.userData}>{login} {role && (`(${role})`)}</Link>
                <Link to={`/users/${author_id}`} className={styles.userData}>{full_name}</Link>
                <Link to={`/users/${author_id}`} className={styles.rating}>
                    {rating ?
                        <>
                            <ThumbsUpDownIcon color="success" />
                            <span style={{ marginLeft: '5px' }}>{rating}</span>
                        </>
                        : <></>}
                </Link>
            </div>
            <span className={styles.additional}>{publish_date}</span>
        </div >
    );
};
