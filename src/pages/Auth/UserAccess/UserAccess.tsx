// components/UserAccess/UserAccess.tsx
import { useLocation, Link } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import classNames from 'classnames/bind'
import styles from './UserAccess.module.scss'
import thumbnail from 'src/assets/images/Thumbnail.png'
import { routes } from 'src/config'
import SEO from 'src/components/SeoHelmet'
import FormWrapper from './components/FormWrapper'
import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'

const cx = classNames.bind(styles)

export default function UserAccess() {
    const location = useLocation()
    const isLogin = location.pathname.includes('/auth/login')

    return (
        <div className={cx('container')}>
            <SEO
                title={isLogin ? 'Login | S-blog' : 'Register | S-blog'}
                description={isLogin ? 'Log in to your account...' : 'Create an account...'}
                path={routes.blogList}
                image='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiYVq9zoC-Zcg9eFZliPXWxWxBLHqer4bfLg&s'
                type='website'
            />
            <div className={cx('left-section')}>
                <img src={thumbnail} alt='Thumbnail' className={cx('thumbnail')} />
                <div className={cx('brand-info')}>
                    <h2 className={cx('team-heading')}>BTB Team</h2>
                    <p className={cx('team-description')}>
                        "At 'S Blog', we provide an easy-to-use platform for you to create and share your stories with
                        the world."
                    </p>
                </div>
            </div>
            <div className={cx('right-section')}>
                <AnimatePresence mode='wait' custom={isLogin}>
                    <FormWrapper isLogin={isLogin} className={cx('form')}>
                        <h1 className={cx('form-heading')}>{isLogin ? 'Sign In' : 'Sign Up'}</h1>
                        {isLogin ? <LoginForm /> : <RegisterForm />}
                        <p className={cx('form-footer')}>
                            <Link to={isLogin ? routes.register : routes.login}>
                                {isLogin ? "Don't have an account?" : 'Already have an account?'}
                                <strong> {isLogin ? 'Sign up.' : 'Log in.'}</strong>
                            </Link>
                        </p>
                    </FormWrapper>
                </AnimatePresence>
            </div>
        </div>
    )
}
