import * as yup from 'yup'

export const schema = yup.object({
    first_name: yup.string().trim().max(160, 'Length from 1-160 characters').required('First name is required'),
    last_name: yup.string().trim().max(160, 'Length from 6-160 characters').required('Last name is required'),
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
    confirm_password: yup
        .string()
        .oneOf([yup.ref('password')], 'Confirmation password does not match')
        .required('Confirm password is required'),
    old_password: yup.string().required('Old password is required'),
    username: yup
        .string()
        .trim()
        .matches(/^[a-zA-Z0-9._]+$/, 'Usernames can only contain letters, numbers, underscores, and periods.')
        .max(80, 'Length from 1-80 characters')
        .required('Username is required'),
    bio: yup.string().trim().max(80, 'Length from 0-80 characters'),
    avatar: yup.string().trim(),
    social_links: yup.array().of(yup.string().trim().url('Invalid URL format'))
})
export const blogSchema = yup.object({
    title: yup
        .string()
        .trim()
        .required('title is required')
        .min(6, 'Length from 6-300 characters')
        .max(300, 'Length from 6-300 characters'),
    sub_title: yup
        .string()
        .trim()
        .required('description is required')
        .min(6, 'Length from 6-300 characters')
        .max(300, 'Length from 6-300 characters'),
    feature_image: yup.string().trim().required('thumbnail is required'),
    content: yup.string().trim().required('content is required'),
    categories: yup.array().of(yup.string().trim()).min(1, 'Must select at least one category')
})

export type SchemaType = yup.InferType<typeof schema>
export type BlogSchemaType = yup.InferType<typeof blogSchema>
