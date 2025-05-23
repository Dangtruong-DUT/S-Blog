import React from 'react'
import classNames from 'classnames/bind'
import styles from '../BlogDetail.module.scss'

const cx = classNames.bind(styles)

interface BlogDetailLayoutProps {
    sidebar: React.ReactNode
    content: React.ReactNode
    actions: React.ReactNode
    comments: React.ReactNode
}

const BlogDetailLayout: React.FC<BlogDetailLayoutProps> = React.memo(({ sidebar, content, actions, comments }) => (
    <section className={cx('blog-detail')}>
        <div className={cx('blogDetail__contentWrapper')}>
            {sidebar}
            {content}
            {actions}
        </div>
        <div className={cx('blogDetail__comments')}>{comments}</div>
    </section>
))

export default BlogDetailLayout
