import React from 'react';
import { Post } from '../index';

export const Posts = ({ posts, isPostsLoading, userData }) => {
    return (
        <>
            {(isPostsLoading ? [...Array(5)] : posts).map((obj, index) =>
                isPostsLoading ? (
                    <Post key={index} isLoading={true} />
                ) : (
                    <Post
                        key={index}
                        id={obj.id}
                        author_id={obj.author_id}
                        title={obj.title}
                        avatar={`http://localhost:3001/avatar/${obj.avatar}`}
                        login={obj.login}
                        full_name={obj.full_name}
                        publish_date={new Date(obj.publish_date).toLocaleDateString()}
                        likesCount={obj.likes ? obj.likes.count : 0}
                        commentsCount={obj.comments ? obj.comments.count : 0}
                        categories={obj.categories}
                        status={obj.status}
                        isEditable={(userData?.id === obj.author_id) || userData?.admin}
                    />
                )
            )}
        </>

    );
}