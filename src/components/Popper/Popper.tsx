import classNames from 'classnames/bind'
import Styles from './Popper.module.scss'
import { ReactNode } from 'react'

const cx = classNames.bind(Styles)

interface WrapperProps {
    children: ReactNode
    className?: string
}

function Wrapper({ children, className }: WrapperProps) {
    const wrapperClassNames = cx('wrapper', className)
    return <div className={wrapperClassNames}>{children}</div>
}

export default Wrapper
