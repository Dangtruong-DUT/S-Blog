import { ComponentProps, ElementType, ReactNode } from 'react'
import classNames from 'classnames/bind'
import styles from './Button.module.scss'
import { Link } from 'react-router-dom'

const cx = classNames.bind(styles)

interface ButtonProps extends ComponentProps<'button'> {
    children: ReactNode
    variant?: 'primary' | 'secondary' | 'positive' | 'danger' | 'caution' | 'info' | 'neutral'
    outline?: boolean
    curve?: boolean
    disabled?: boolean
    className?: string
    to?: string
    href?: string
}

const Button = ({ children, variant, outline, curve, disabled, className, to, href, ...props }: ButtonProps) => {
    let Component: ElementType = 'button'

    if (to) {
        Component = Link
    } else if (href) {
        Component = 'a'
    }

    const buttonClass = cx(
        'button',
        {
            [`button--${variant}`]: variant,
            'button--outline': outline,
            'button--curve': curve,
            'button--disabled': disabled
        },
        className
    )

    return (
        <Component {...props} to={to} href={href} className={buttonClass} disabled={disabled}>
            {children}
        </Component>
    )
}

export default Button
