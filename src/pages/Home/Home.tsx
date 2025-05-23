import classNames from 'classnames/bind'
import styles from './Home.module.scss'
import Button from 'src/components/Button'
import { FaPenFancy } from 'react-icons/fa' // Icon viết blog
import { routes } from 'src/config'
import SEO from 'src/components/SeoHelmet'

const cx = classNames.bind(styles)

function Home() {
    return (
        <>
            <SEO
                title='Trang chủ S-Blog'
                description='Khám phá các bài viết, blog, chủ đề nổi bật trên S-Blog. Nền tảng chia sẻ tri thức, công nghệ, lập trình, phát triển bản thân và nhiều lĩnh vực khác.'
                path='/'
            />
            <div className={cx('container')}>
                <h1 className={cx('title')}>Welcome to Our Blogging Community</h1>
                <p className={cx('description')}>
                    Are you passionate about writing and sharing your knowledge? Our platform is a space where anyone
                    can become a blogger and contribute valuable insights, ideas, and experiences. Whether you're a tech
                    enthusiast, a creative writer, or an expert in any field, this is your place to inspire and connect
                    with like-minded individuals.
                </p>
                <Button className={cx('button')} to={routes.createBlog}>
                    <FaPenFancy className={cx('icon')} />
                    Start Writing
                </Button>
            </div>
        </>
    )
}

export default Home
