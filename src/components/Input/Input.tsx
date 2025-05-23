/* eslint-disable @typescript-eslint/no-explicit-any */
import { HTMLInputTypeAttribute, useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import classNames from 'classnames/bind'
import styles from './Input.module.scss'
import { RegisterOptions, UseFormRegister } from 'react-hook-form'

const cx = classNames.bind(styles)

interface InputProps {
    className?: string
    classInput?: string
    id?: string
    errorMessage?: string
    type?: HTMLInputTypeAttribute
    placeholder?: string
    label: string
    name: string
    rules?: RegisterOptions<any>
    register: UseFormRegister<any>
}

function Input({
    classInput,
    className,
    label,
    id,
    name,
    type = 'text',
    placeholder = ' ',
    errorMessage,
    register,
    rules
}: InputProps) {
    const [showPassword, setShowPassword] = useState(false)
    const isPassword = type === 'password'
    const classes = cx('form-group', className)
    const classInputs = cx(classInput)
    return (
        <div className={classes}>
            <input
                className={classInputs}
                type={isPassword && showPassword ? 'text' : type}
                id={id}
                placeholder={placeholder}
                autoComplete={isPassword ? 'on' : undefined}
                {...register(name, rules)}
            />
            <label htmlFor={id}>{label}</label>
            <span className={cx('formMessage')}>{errorMessage}</span>
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
