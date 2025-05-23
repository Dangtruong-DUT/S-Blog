import styles from './BlogsPage.module.scss'
import classNames from 'classnames/bind'
import SearchBar from './components/SearchBar'
import BlogList from 'src/components/BlogList/BlogList'
import { useLocation } from 'react-router-dom'
import useQueryConfig from 'src/hooks/useQueryConfig'
import { routes } from 'src/config'
import SEO from 'src/components/SeoHelmet'

const cx = classNames.bind(styles)

function BlogsPage() {
    const location = useLocation()
    const isNewBlogsPage = location.pathname.includes('/new')
    const queryConfig = useQueryConfig()

    return (
        <div className={cx('blogListWrapper')}>
            <SEO
                title='Danh sách Blog | S-Blog'
                description='Tổng hợp các bài viết, blog mới nhất, nổi bật nhất trên S-Blog. Khám phá, tìm kiếm và chia sẻ tri thức cùng cộng đồng.'
                path='/blogs'
            />
            {isNewBlogsPage && <SearchBar />}
            <BlogList queryKey={'blogList'} queryConfig={queryConfig} path={routes.blogList} />
        </div>
    )
}

export default BlogsPage
