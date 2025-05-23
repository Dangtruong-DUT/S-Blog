import React from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames/bind'
import styles from './AuthSwitchLink.module.scss'
import { routes } from 'src/config'

const cx = classNames.bind(styles)

interface AuthSwitchLinkProps {
    isLogin: boolean
}

const AuthSwitchLink: React.FC<AuthSwitchLinkProps> = React.memo(({ isLogin }) => (
    <p className={cx('form-footer')}>
        <Link to={isLogin ? routes.register : routes.login}>
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            <strong> {isLogin ? 'Sign up.' : 'Log in.'}</strong>
        </Link>
    </p>
))

export default AuthSwitchLink
