import { motion } from 'framer-motion'
import { memo } from 'react'

interface FormWrapperProps {
    children: React.ReactNode
    isLogin: boolean
    className?: string
}

function FormWrapper({ children, isLogin, className }: FormWrapperProps) {
    return (
        <motion.div
            key={isLogin ? 'login' : 'register'}
            initial='initial'
            animate='animate'
            exit='exit'
            variants={formVariants}
            custom={isLogin}
            className={className}
        >
            {children}
        </motion.div>
    )
}

const formVariants = {
    initial: (isLogin: boolean) => ({
        x: isLogin ? 50 : -50,
        opacity: 0
    }),
    animate: {
        x: 0,
        opacity: 1,
        transition: { duration: 0.25, ease: 'easeOut' }
    },
    exit: (isLogin: boolean) => ({
        x: isLogin ? -50 : 50,
        opacity: 0,
        transition: { duration: 0.25, ease: 'easeIn' }
    })
}

export default memo(FormWrapper)
