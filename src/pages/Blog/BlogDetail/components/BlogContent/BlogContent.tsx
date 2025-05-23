import { memo } from 'react'
import styles from './BlogContent.module.scss'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

interface BlogContentProps {
    html: string
}

function BlogContent({ html }: BlogContentProps) {
    return (
        <div
            dangerouslySetInnerHTML={{ __html: html }}
            className={cx('previewContent', 'ql-editor htmlConverter', 'blogContent')}
        />
    )
}

export default memo(BlogContent)
