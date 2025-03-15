import classNames from 'classnames/bind'
import styles from './Home.module.scss'
import Button from 'src/components/Button'
import { FaPenFancy } from 'react-icons/fa' // Icon viết blog
import { routes } from 'src/config'
import SEO from 'src/components/SeoHelmet'

const cx = classNames.bind(styles)

function Home() {
    return (
        <div className={cx('container')}>
            <SEO
                description=' Are you passionate about writing and sharing your knowledge? Our platform is a space where anyone can
                become a blogger and contribute valuable insights, ideas, and experiences. Whether youre a tech
                enthusiast, a creative writer, or an expert in any field, this is your place to inspire and connect with
                like-minded individuals.'
                title='Welcome to Our Blogging Community'
                path='/'
                image='data:image/jpeg;base64,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'
            />
            <h1 className={cx('title')}>Welcome to Our Blogging Community</h1>
            <p className={cx('description')}>
                Are you passionate about writing and sharing your knowledge? Our platform is a space where anyone can
                become a blogger and contribute valuable insights, ideas, and experiences. Whether you're a tech
                enthusiast, a creative writer, or an expert in any field, this is your place to inspire and connect with
                like-minded individuals.
            </p>
            <Button className={cx('button')} to={routes.createBlog}>
                <FaPenFancy className={cx('icon')} />
                Start Writing
            </Button>
        </div>
    )
}

export default Home
