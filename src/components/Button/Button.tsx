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
    loading?: boolean
    classNameInner?: string
}

const Button = ({
    children,
    variant,
    outline,
    curve,
    disabled,
    className,
    classNameInner,
    to,
    href,
    loading,
    ...props
}: ButtonProps) => {
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
            'button--disabled': disabled || loading
        },
        className
    )

    return (
        <Component {...props} to={to} href={href} className={buttonClass} disabled={disabled || loading}>
            <div className={cx('button-inner', classNameInner)}>
                <span className={cx('button-content', { 'button-content--hidden': loading })}>{children}</span>
                {loading && (
                    <div className={cx('loader')}>
                        <div className={cx('spinner')}></div>
                    </div>
                )}
            </div>
        </Component>
    )
}

export default Button
