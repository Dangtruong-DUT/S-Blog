import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Input from 'src/components/Input'
import Button from 'src/components/Button'
import { schema, SchemaType } from 'src/utils/rules.util'
import { routes } from 'src/config'
import { AppContext } from 'src/contexts/app.context'
import authApi from 'src/apis/auth.api'
import handleFormError from 'src/utils/handleFormError.util'
import { UserMessage } from 'src/constants/Message'
import LoadingIcon from 'src/components/LoadingIcon'
import { memo, useContext } from 'react'
import classNames from 'classnames/bind'
import styles from './LoginForm.module.scss'

type FormLoginData = Pick<SchemaType, 'email' | 'password'>
const loginSchema = schema.pick(['email', 'password'])

const cx = classNames.bind(styles)

function LoginForm() {
    const { setAuthenticated, setProfile } = useContext(AppContext)
    const navigate = useNavigate()
    const loginForm = useForm<FormLoginData>({ resolver: yupResolver(loginSchema) })

    const loginMutation = useMutation({
        mutationFn: (body: FormLoginData) => authApi.login(body),
        onSuccess: (data) => {
            setAuthenticated(true)
            navigate(routes.blogList)
            toast.success(UserMessage.LOGIN_SUCCESS)
            setProfile(data.data.data.user)
        },
        onError: (error) => handleFormError<FormLoginData>(error, loginForm)
    })

    const handleLoginSubmit = loginForm.handleSubmit((body) => {
        loginMutation.mutate(body)
    })

    return (
        <form onSubmit={handleLoginSubmit} noValidate className={cx('container')}>
            <Input
                id='email'
                label='Your Email'
                type='email'
                name='email'
                register={loginForm.register}
                errorMessage={loginForm.formState.errors.email?.message}
            />
            <Input
                id='password'
                label='Password'
                type='password'
                name='password'
                register={loginForm.register}
                errorMessage={loginForm.formState.errors.password?.message}
            />
            <Button type='submit' variant='primary' disabled={loginMutation.isPending} className={cx('submit-button')}>
                {loginMutation.isPending && <LoadingIcon />}
                Sign In
            </Button>
        </form>
    )
}

export default memo(LoginForm)
