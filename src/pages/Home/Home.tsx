import classNames from 'classnames/bind'
import styles from './Home.module.scss'
import Button from 'src/components/Button'
import { FaPenFancy } from 'react-icons/fa' // Icon viết blog
import { routes } from 'src/config'

const cx = classNames.bind(styles)

function Home() {
    return (
        <div className={cx('container')}>
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
