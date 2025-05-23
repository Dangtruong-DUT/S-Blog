import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Input from 'src/components/Input'
import Button from 'src/components/Button'
import { schema, SchemaType } from 'src/utils/rules.util'
import { omit } from 'lodash'
import { routes } from 'src/config'
import { AppContext } from 'src/contexts/app.context'
import authApi from 'src/apis/auth.api'
import handleFormError from 'src/utils/handleFormError.util'
import { UserMessage } from 'src/constants/Message'
import LoadingIcon from 'src/components/LoadingIcon'
import { useContext } from 'react'
import styles from './RegisterForm.module.scss'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

type FormRegisterData = Pick<SchemaType, 'email' | 'confirm_password' | 'first_name' | 'last_name' | 'password'>

const registerSchema = schema.pick(['email', 'first_name', 'last_name', 'confirm_password', 'password'])

function RegisterForm() {
    const { setAuthenticated, setProfile } = useContext(AppContext)
    const navigate = useNavigate()
    const registerForm = useForm<FormRegisterData>({ resolver: yupResolver(registerSchema) })

    const registerAccountMutation = useMutation({
        mutationFn: (body: Omit<FormRegisterData, 'confirm_password'>) => authApi.registerAccount(body),
        onSuccess: (data) => {
            setAuthenticated(true)
            navigate(routes.blogList)
            toast.success(UserMessage.REGISTER_SUCCESS)
            setProfile(data.data.data.user)
        },
        onError: (error) => handleFormError<FormRegisterData>(error, registerForm)
    })

    const handleRegisterSubmit = registerForm.handleSubmit((data) => {
        const body = omit(data, ['confirm_password'])
        registerAccountMutation.mutate(body)
    })

    return (
        <form onSubmit={handleRegisterSubmit} noValidate className={cx('container')}>
            <Input
                id='firstName'
                name='first_name'
                label='First Name'
                register={registerForm.register}
                errorMessage={registerForm.formState.errors.first_name?.message}
            />
            <Input
                id='lastName'
                name='last_name'
                label='Last Name'
                register={registerForm.register}
                errorMessage={registerForm.formState.errors.last_name?.message}
            />
            <Input
                id='email'
                label='Your Email'
                type='email'
                name='email'
                register={registerForm.register}
                errorMessage={registerForm.formState.errors.email?.message}
            />
            <Input
                id='password'
                label='Password'
                type='password'
                name='password'
                register={registerForm.register}
                errorMessage={registerForm.formState.errors.password?.message}
            />
            <Input
                id='confirm_password'
                label='Confirm Password'
                type='password'
                name='confirm_password'
                register={registerForm.register}
                errorMessage={registerForm.formState.errors.confirm_password?.message}
            />
            <Button
                type='submit'
                variant='primary'
                disabled={registerAccountMutation.isPending}
                className={cx('submit-button')}
            >
                {registerAccountMutation.isPending && <LoadingIcon />}
                Sign Up
            </Button>
        </form>
    )
}

export default RegisterForm
