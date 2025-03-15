import { useMutation } from '@tanstack/react-query'
import classNames from 'classnames/bind'
import { useForm } from 'react-hook-form'
import { useContext, useMemo } from 'react'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { yupResolver } from '@hookform/resolvers/yup'
import styles from './UserAccess.module.scss'
import thumbnail from 'src/assets/images/Thumbnail.png'
import Button from 'src/components/Button'
import { routes } from 'src/config'
import Input from 'src/components/Input'
import { schema, SchemaType } from 'src/utils/rules.util'
import { omit } from 'lodash'
import { toast } from 'react-toastify'
import { UserMessage } from 'src/constants/Message'
import handleFormError from 'src/utils/handleFormError.util'
import { AppContext } from 'src/contexts/app.context'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import authApi from 'src/apis/auth.api'
import SEO from 'src/components/SeoHelmet'

const cx = classNames.bind(styles)

type FormRegisterData = Pick<SchemaType, 'email' | 'confirmPassword' | 'firstName' | 'lastName' | 'password'>
type FormLoginData = Pick<SchemaType, 'email' | 'password'>

const registerSchema = schema.pick(['email', 'firstName', 'lastName', 'confirmPassword', 'password'])

const loginSchema = schema.pick(['email', 'password'])

const formVariants = {
    initial: (isLogin: boolean) => ({
        x: isLogin ? 50 : -50,
        opacity: 0
    }),
    animate: { x: 0, opacity: 1, transition: { duration: 0.25, ease: 'easeOut' } },
    exit: (isLogin: boolean) => ({
        x: isLogin ? -50 : 50,
        opacity: 0,
        transition: { duration: 0.25, ease: 'easeIn' }
    })
}

function UserAccess() {
    const { setAuthenticated, setProfile } = useContext(AppContext)
    const navigate = useNavigate()

    const location = useLocation()
    const isLogin = useMemo(() => location.pathname.includes('/auth/login'), [location.pathname])
    const registerAccountMutation = useMutation({
        mutationFn: (body: Omit<FormRegisterData, 'confirmPassword'>) => authApi.registerAccount(body)
    })

    const loginMutation = useMutation({
        mutationFn: (body: FormLoginData) => authApi.login(body)
    })
    const registerForm = useForm<FormRegisterData>({
        resolver: yupResolver(registerSchema)
    })
    const loginForm = useForm<FormLoginData>({
        resolver: yupResolver(loginSchema)
    })

    const handleRegisterSubmit = registerForm.handleSubmit((data) => {
        const body = omit(data, ['confirmPassword'])
        registerAccountMutation.mutate(body, {
            onSuccess: (data) => {
                setAuthenticated(true)
                navigate(routes.blogList)
                toast.success(UserMessage.REGISTER_SUCCESS)
                setProfile(data.data.data.user)
            },
            onError: (error) => handleFormError<FormRegisterData>(error, registerForm)
        })
    })

    const handleLoginSubmit = loginForm.handleSubmit((body) => {
        loginMutation.mutate(body, {
            onSuccess: (data) => {
                setAuthenticated(true)
                navigate(routes.blogList)
                toast.success(UserMessage.LOGIN_SUCCESS)
                setProfile(data.data.data.user)
            },
            onError: (error) => handleFormError<FormLoginData>(error, loginForm)
        })
    })

    return (
        <div className={cx('container')}>
            {isLogin ? (
                <SEO
                    title='Login | S-blog'
                    description='Log in to your account and start sharing your blogs with the world.'
                    path={routes.blogList}
                    image={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiYVq9zoC-Zcg9eFZliPXWxWxBLHqer4bfLg&s`}
                    type='website'
                />
            ) : (
                <SEO
                    title='Register | S-blog'
                    description='Create an account and start your blogging journey today.'
                    path={routes.blogList}
                    image={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiYVq9zoC-Zcg9eFZliPXWxWxBLHqer4bfLg&s`}
                    type='website'
                />
            )}
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
                    <motion.form
                        key={isLogin ? 'login' : 'register'}
                        className={cx('form')}
                        onSubmit={isLogin ? handleLoginSubmit : handleRegisterSubmit}
                        noValidate
                        custom={isLogin}
                        initial='initial'
                        animate='animate'
                        exit='exit'
                        variants={formVariants}
                    >
                        <h1 className={cx('form-heading')}>{isLogin ? 'Sign In' : 'Sign Up'}</h1>

                        {!isLogin && (
                            <>
                                <Input
                                    id='firstName'
                                    name='firstName'
                                    label='First Name'
                                    register={registerForm.register}
                                    errorMessage={registerForm.formState.errors.firstName?.message}
                                />

                                <Input
                                    id='lastName'
                                    label='Last Name'
                                    name='lastName'
                                    register={registerForm.register}
                                    rules={{
                                        required: {
                                            value: true,
                                            message: 'last name is required'
                                        }
                                    }}
                                    errorMessage={registerForm.formState.errors.lastName?.message}
                                />
                            </>
                        )}

                        <Input
                            id='email'
                            label='Your Email'
                            type='email'
                            name='email'
                            register={isLogin ? loginForm.register : registerForm.register}
                            errorMessage={
                                isLogin
                                    ? loginForm.formState.errors.email?.message
                                    : registerForm.formState.errors.email?.message
                            }
                        />

                        <Input
                            id='password'
                            label='Password'
                            type='password'
                            name='password'
                            register={isLogin ? loginForm.register : registerForm.register}
                            errorMessage={
                                isLogin
                                    ? loginForm.formState.errors.password?.message
                                    : registerForm.formState.errors.password?.message
                            }
                        />

                        {!isLogin && (
                            <Input
                                id='confirmPassword'
                                label='Confirm Password'
                                type='password'
                                name='confirmPassword'
                                register={registerForm.register}
                                errorMessage={registerForm.formState.errors.confirmPassword?.message}
                            />
                        )}

                        <Button
                            variant='primary'
                            type='submit'
                            className={cx('form-btn')}
                            disabled={loginMutation.isPending || registerAccountMutation.isPending}
                        >
                            {(loginMutation.isPending || registerAccountMutation.isPending) && (
                                <AiOutlineLoading3Quarters className={cx('loading-icon')} />
                            )}
                            {isLogin ? 'Sign In' : 'Sign Up'}
                        </Button>

                        <p className={cx('form-footer')}>
                            <Link to={isLogin ? routes.register : routes.login}>
                                {isLogin ? "Don't have an account?" : 'Already have an account?'}
                                <strong> {isLogin ? 'Sign up.' : 'Log in.'}</strong>
                            </Link>
                        </p>
                    </motion.form>
                </AnimatePresence>
            </div>
        </div>
    )
}

export default UserAccess
