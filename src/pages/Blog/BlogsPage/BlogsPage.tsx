import styles from './BlogsPage.module.scss'
import classNames from 'classnames/bind'
import SearchBar from './components/SearchBar'
import BlogList from 'src/components/BlogList/BlogList'
import { useLocation } from 'react-router-dom'
import useQueryConfig from 'src/hooks/useQueryConfig'
import { routes } from 'src/config'

const cx = classNames.bind(styles)

function BlogsPage() {
    const location = useLocation()
    const isNewBlogsPage = location.pathname.includes('/new')
    const queryConfig = useQueryConfig()

    return (
        <div className={cx('blogListWrapper')}>
            {isNewBlogsPage && <SearchBar />}
            <BlogList queryKey={'blogList'} queryConfig={queryConfig} path={routes.blogList} />
        </div>
    )
}

export default BlogsPage
