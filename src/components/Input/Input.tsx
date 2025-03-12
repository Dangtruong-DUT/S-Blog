/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import classNames from 'classnames/bind'
import styles from './Input.module.scss'

const cx = classNames.bind(styles)

interface InputProps {
    label: string
    id?: string
    type?: 'text' | 'email' | 'password'
    placeholder?: string
    error?: string
    [key: string]: any
}

function Input({ label, id, type = 'text', placeholder = ' ', error }: InputProps) {
    const [showPassword, setShowPassword] = useState(false)
    const isPassword = type === 'password'

    return (
        <div className={cx('form-group')}>
            <input
                type={isPassword && showPassword ? 'text' : type}
                id={id}
                placeholder={placeholder}
                autoComplete={isPassword ? 'on' : undefined}
            />
            <label htmlFor={id}>{label}</label>
            <div className={cx('formMessage')}>{error}</div>
            {isPassword && (
                <button
                    type='button'
                    className={cx('password-toggle-btn')}
                    onClick={() => setShowPassword(!showPassword)}
                >
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                </button>
            )}
        </div>
    )
}

export default Input
