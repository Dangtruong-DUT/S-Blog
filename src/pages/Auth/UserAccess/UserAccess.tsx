import { AnimatePresence } from 'framer-motion'
import classNames from 'classnames/bind'
import styles from './UserAccess.module.scss'
import SEO from 'src/components/SeoHelmet'
import BrandInfo from './components/BrandInfo'
import Thumbnail from './components/Thumbnail'
import AuthSwitchLink from './components/AuthSwitchLink'
import UserAccessLayout from './components/UserAccessLayout'
import FormWrapper from './components/FormWrapper'
import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
import { useAuthMode } from './hooks/useAuthMode'
import FormHeading from './components/FormHeading'

const cx = classNames.bind(styles)

export default function UserAccess() {
    const { isLogin } = useAuthMode()

    const left = (
        <>
            <Thumbnail />
            <BrandInfo />
        </>
    )
    const right = (
        <AnimatePresence mode='wait' custom={isLogin}>
            <FormWrapper isLogin={isLogin} className={cx('form')}>
                <FormHeading isLogin={isLogin} />
                {isLogin ? <LoginForm /> : <RegisterForm />}
                <AuthSwitchLink isLogin={isLogin} />
            </FormWrapper>
        </AnimatePresence>
    )
    return (
        <>
            <SEO
                title='Đăng nhập & Đăng ký | S-Blog'
                description='Đăng nhập, đăng ký tài khoản để tham gia cộng đồng S-Blog, chia sẻ và khám phá tri thức.'
                path='/auth'
            />
            <UserAccessLayout left={left} right={right} />
        </>
    )
}
