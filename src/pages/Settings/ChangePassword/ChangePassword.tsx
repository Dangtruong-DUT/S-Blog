import Button from 'src/components/Button'
import styles from './ChangePassword.module.scss'
import classNames from 'classnames/bind'
import Input from 'src/components/InputV2'
import { useForm } from 'react-hook-form'
import { schema, SchemaType } from 'src/utils/rules.util'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import userApi from 'src/apis/user.api'
import handleFormError from 'src/utils/handleFormError.util'
import { toast } from 'react-toastify'
import SEO from 'src/components/SeoHelmet'

const cx = classNames.bind(styles)

type changePasswordData = Pick<SchemaType, 'old_password' | 'password' | 'confirm_password'>

const changePasswordSchema = schema.pick(['confirm_password', 'password', 'old_password'])

function ChangePassWord() {
    const changePasswordForm = useForm<changePasswordData>({
        resolver: yupResolver(changePasswordSchema),
        defaultValues: {
            confirm_password: '',
            password: '',
            old_password: ''
        }
    })
    const { mutate: changePasswordMutate, isPending: isSubmitPending } = useMutation({
        mutationFn: userApi.changePassword
    })

    const onFormSubmit = changePasswordForm.handleSubmit((data) => {
        const body = {
            old_password: data.old_password,
            new_password: data.password,
            confirm_password: data.confirm_password
        }
        changePasswordMutate(body, {
            onSuccess: () => {
                changePasswordForm.reset()
                toast.success('Change password successfully')
            },
            onError: (error) => handleFormError<changePasswordData>(error, changePasswordForm)
        })
    })
    return (
        <>
            <SEO
                title='Đổi mật khẩu | S-Blog'
                description='Thay đổi mật khẩu, tăng cường bảo mật tài khoản của bạn trên S-Blog.'
                path='/settings/change-password'
            />
            <div className={cx('profile')}>
                <h1 className={cx('profile__title')}>Change Password</h1>
                <form className={cx('formWrapper')} method='post' noValidate onSubmit={onFormSubmit}>
                    <div className={cx('form-group')}>
                        <Input
                            type='password'
                            register={changePasswordForm.register}
                            name='old_password'
                            errorMessage={changePasswordForm.formState.errors.old_password?.message}
                            label='Password'
                            id='old_password'
                            placeholder='Enter your password'
                        />
                    </div>
                    <div className={cx('form-group')}>
                        <Input
                            type='password'
                            register={changePasswordForm.register}
                            name='password'
                            errorMessage={changePasswordForm.formState.errors.password?.message}
                            label='New password'
                            id='new_password'
                            placeholder='Enter your new password'
                        />
                    </div>
                    <div className={cx('form-group')}>
                        <Input
                            type='password'
                            name='confirm_password'
                            register={changePasswordForm.register}
                            errorMessage={changePasswordForm.formState.errors.confirm_password?.message}
                            label='Confirm password'
                            id='confirm_password'
                            placeholder='Confirm your new password'
                        />
                    </div>
                    <Button
                        variant='primary'
                        type='submit'
                        className={cx('form-btnSubmit')}
                        disabled={isSubmitPending}
                        loading={isSubmitPending}
                    >
                        Save
                    </Button>
                </form>
            </div>
        </>
    )
}

export default ChangePassWord
