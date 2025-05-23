import React from 'react'
import classNames from 'classnames/bind'
import AccountItem from '../AccountItem'
import { Blog } from 'src/types/blog.type'
import styles from './SearchBar.module.scss'
import { generateNameId } from 'src/utils/common.util'

const cx = classNames.bind(styles)

const PostResults: React.FC<{ posts: Blog[] }> = React.memo(({ posts }) => (
    <section>
        <h4 className={cx('search-title')}>Posts</h4>
        <ul>
            {posts.map((post) => (
                <li key={post.id}>
                    <AccountItem
                        avatarSize='40px'
                        avatar={post.featured_image}
                        title={post.title}
                        nameAccount={post.title}
                        verified={false}
                        to={`/blogs/${generateNameId({ name: post.title, id: post.id })}`}
                    />
                </li>
            ))}
        </ul>
    </section>
))

export default PostResults
