import * as yup from 'yup'

export const schema = yup.object({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    email: yup
        .string()
        .required('Email is required')
        .matches(/^\S+@\S+\.\S+$/, 'Email is not in correct format')
        .min(5, 'Length from 5-160 characters')
        .max(160, 'Length from 5-160 characters'),
    password: yup
        .string()
        .required('Password is required')
        .min(6, 'Length from 6-160 characters')
        .max(160, 'Length from 6-160 characters'),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password')], 'Confirmation password does not match')
        .required('Confirm password is required')
})

export type SchemaType = yup.InferType<typeof schema>
