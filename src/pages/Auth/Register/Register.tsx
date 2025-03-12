import classNames from 'classnames/bind'
import { useForm } from 'react-hook-form'
import styles from './Register.module.scss'
import thumbnail from 'src/assets/images/Thumbnail.png'
import Button from 'src/components/Button'
import { Link } from 'react-router-dom'
import { routes } from 'src/config'
import { getRules } from 'src/utils/rules.util'
import Input from 'src/components/Input'

const cx = classNames.bind(styles)

interface FormData {
    email: string
    password: string
    confirmPassword: string
    firstName: string
    lastName: string
}

function Register() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues
    } = useForm<FormData>()

    const rules = getRules<FormData>(getValues)

    const onSubmit = handleSubmit((data) => {
        console.log(data)
    })

    return (
        <div className={cx('register-container')}>
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
                <form className={cx('register-form')} onSubmit={onSubmit} noValidate>
                    <h1 className={cx('form-heading')}>Sign Up</h1>

                    <Input
                        id='firstName'
                        label='First Name'
                        {...register('firstName', {
                            required: 'first name is required'
                        })}
                        error={errors.firstName?.message}
                    />

                    <Input
                        label='Last Name'
                        {...register('lastName', {
                            required: 'last name is required'
                        })}
                        error={errors.lastName?.message}
                    />

                    <Input
                        label='Your Email'
                        type='email'
                        {...register('email', rules.email)}
                        error={errors.email?.message}
                    />

                    <Input
                        label='Password'
                        type='password'
                        {...register('password', rules.password)}
                        error={errors.password?.message}
                        showPasswordToggle
                    />

                    <Input
                        label='Confirm Password'
                        type='password'
                        {...register('confirmPassword', rules.confirmPassword)}
                        error={errors.confirmPassword?.message}
                        showPasswordToggle
                    />

                    <Button variant='primary' type='submit' className={cx('form-btn')}>
                        Sign Up
                    </Button>

                    <p className={cx('form-footer')}>
                        <Link to={routes.login}>
                            Already have an account?
                            <strong> Log in.</strong>
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default Register
