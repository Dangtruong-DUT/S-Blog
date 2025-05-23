import React from 'react'
import classNames from 'classnames/bind'
import styles from './FormHeading.module.scss'

const cx = classNames.bind(styles)

interface FormHeadingProps {
    isLogin: boolean
}

const FormHeading: React.FC<FormHeadingProps> = React.memo(({ isLogin }) => (
    <h1 className={cx('form-heading')}>{isLogin ? 'Sign In' : 'Sign Up'}</h1>
))

export default FormHeading
