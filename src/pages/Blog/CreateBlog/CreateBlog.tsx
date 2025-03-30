import { useContext, useEffect, useRef, useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import 'highlight.js/styles/atom-one-dark.css'
import Modal from 'react-modal'
import EditorQuill from 'src/components/EditorQuill'
import Button from 'src/components/Button'
import InputFile from 'src/components/InputFile/InputFile'
import classNames from 'classnames/bind'
import styles from './CreateBlog.module.scss'
import thumbnailDefault from 'src/assets/images/Thumbnail.png'
import { blogSchema, BlogSchemaType } from 'src/utils/rules.util'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import MultiSelectCategory from 'src/components/MultiSelectCategory'
import { convertToHtml } from 'src/utils/convertQuillToHTML'
import hljs from 'highlight.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import blogApi from 'src/apis/blog.api'
import { useMatch, useNavigate, useParams } from 'react-router-dom'
import { routes } from 'src/config'
import { toast } from 'react-toastify'
import uploadApi from 'src/apis/upload.api'
import handleFormError from 'src/utils/handleFormError.util'
import { Blog } from 'src/types/blog.type'
import SkeletonBlogCart from 'src/components/Skeleton'
import { IoArrowBackCircle } from 'react-icons/io5'
import { AppContext } from 'src/contexts/app.context'

Modal.setAppElement('#root')

type FormData = BlogSchemaType

const formSchema = blogSchema

const cx = classNames.bind(styles)

const BlogEditor = () => {
    const addMatch = useMatch(routes.createBlog)
    const isAddMode = Boolean(addMatch)
    const { id } = useParams()
    const quillRef = useRef<ReactQuill>(null)
    const [isPreviewOpen, setIsPreviewOpen] = useState(false)
    const [fileImage, setFileImage] = useState<File>()
    const navigate = useNavigate()
    const handleBackScreen = () => {
        navigate(-1)
    }
    const { profile } = useContext(AppContext)
    const blogForm = useForm<FormData>({
        defaultValues: {
            content: '',
            sub_title: '',
            title: '',
            categories: [],
            feature_image: ''
        },
        resolver: yupResolver(formSchema)
    })

    const { data, refetch, isLoading } = useQuery({
        queryKey: ['blog', id],
        queryFn: () => blogApi.getBlogDetail(id as string),
        enabled: id !== undefined,
        staleTime: 1000 * 10
    })
    const getContentHtml = () => {
        if (quillRef.current) {
            const editor = quillRef.current.getEditor()
            const delta = editor.getContents()
            hljs.highlightAll()
            return convertToHtml(delta)
        }
        return ''
    }

    const { mutateAsync: createBlogMutate, isPending: submitFormCreatePending } = useMutation({
        mutationFn: blogApi.createBlog
    })

    const { mutateAsync: updateBlogMutation, isPending: submitFormUpdatePending } = useMutation({
        mutationFn: blogApi.updateBlog
    })

    const uploadImageMutation = useMutation({ mutationFn: uploadApi.uploadImage })

    const blog = data?.data.data

    useEffect(() => {
        if (!isAddMode && blog) {
            const hasPermission = blog.author !== profile?.username
            if (hasPermission) {
                navigate(routes.home)
                toast.dismiss()
                toast.error('You do not have permission to access this page!')
            }
        }
    }, [isAddMode, blog, profile, navigate])

    useEffect(() => {
        if (blog) {
            blogForm.setValue('content', blog.content)
            blogForm.setValue('title', blog.title)
            blogForm.setValue('sub_title', blog.sub_title)
            blogForm.setValue('feature_image', blog.feature_image)
            blogForm.setValue('categories', blog.categories)
        }
    }, [blog, blogForm])

    const handleOnSubmit = blogForm.handleSubmit(async (data) => {
        let thumbnail_url
        if (fileImage) {
            try {
                const form = new FormData()
                form.append('image', fileImage)
                const response = await uploadImageMutation.mutateAsync(form)
                thumbnail_url = response.data.data.image
            } catch (error) {
                console.log(error)
                toast.error('An unknown error has occurred. Please try again later.')
            }
        }

        const body: Blog = {
            id: blog?.id || '',
            author: blog?.author || '',
            created_at: blog?.created_at || new Date().toISOString(),
            updated_at: blog?.updated_at || new Date().toISOString(),
            like: blog?.like || 0,
            watched: blog?.watched || 0,
            ...data,
            feature_image: thumbnail_url || data.feature_image,
            categories: data.categories as string[]
        }

        if (isAddMode) {
            await createBlogMutate(body, {
                onSuccess: (data) => {
                    toast.success(data.data.message, {
                        position: 'top-center'
                    })
                    blogForm.reset()
                },
                onError: (error) => handleFormError<FormData>(error, blogForm)
            })
        } else {
            await updateBlogMutation(
                { body: body, id: body.id },
                {
                    onSuccess: (data) => {
                        toast.success(data.data.message, {
                            position: 'top-center'
                        })
                        refetch()
                        handleBackScreen()
                    },
                    onError: (error) => handleFormError<FormData>(error, blogForm)
                }
            )
        }
    })

    return (
        <div className={cx('container')}>
            <div className={cx('heading-wrapper')}>
                {!isAddMode && (
                    <Button variant='primary' outline className={cx('button-back')} onClick={handleBackScreen}>
                        <IoArrowBackCircle size={'3.6rem'} />
                    </Button>
                )}
                <h1>{isAddMode ? 'Create Post' : 'Update Post'}</h1>
            </div>

            {!isLoading && (
                <form method='post' onSubmit={handleOnSubmit} noValidate>
                    <Controller
                        control={blogForm.control}
                        name='categories'
                        render={({ field }) => (
                            <div className={cx('form__row')}>
                                <label className={cx('form-group__label')}>Category</label>
                                <MultiSelectCategory
                                    selectedCategories={field.value as string[]}
                                    onChange={field.onChange}
                                />
                                <span className={cx('form-group__error')}>
                                    {blogForm.formState.errors?.categories?.message}
                                </span>
                            </div>
                        )}
                    />
                    <Controller
                        control={blogForm.control}
                        name='feature_image'
                        render={({ field }) => (
                            <div className={cx('form__row')}>
                                <label className={cx('form-group__label')}>Thumbnail</label>
                                <div className={cx('thumbnailWrapper')}>
                                    <img src={field.value || thumbnailDefault} className={cx('imageReview')} alt='' />
                                    <InputFile
                                        textInnerButton='Choose Thumbnail'
                                        onChange={(file) => {
                                            const fileURL = file !== undefined ? URL.createObjectURL(file) : ''
                                            field.onChange(fileURL)
                                            setFileImage(file)
                                        }}
                                    />
                                </div>
                                <span className={cx('form-group__error')}>
                                    {blogForm.formState.errors?.feature_image?.message}
                                </span>
                            </div>
                        )}
                    />
                    <div className={cx('form__row')}>
                        <label className={cx('form-group__label')}>Title</label>
                        <input
                            type='text'
                            placeholder='Title...'
                            className={cx('form-group__input')}
                            {...blogForm.register('title')}
                        />
                        <span className={cx('form-group__error')}>{blogForm.formState.errors?.title?.message}</span>
                    </div>
                    <div className={cx('form__row')}>
                        <label className={cx('form-group__label')}>Description</label>
                        <input
                            type='text'
                            placeholder='Description...'
                            className={cx('form-group__input')}
                            {...blogForm.register('sub_title')}
                        />
                        <span className={cx('form-group__error')}>
                            {' '}
                            {blogForm.formState.errors?.sub_title?.message}
                        </span>
                    </div>
                    <Controller
                        control={blogForm.control}
                        name='content'
                        render={({ field }) => (
                            <div className={cx('form__row')}>
                                <label className={cx('form-group__label')}>Content</label>
                                <EditorQuill ref={quillRef} onChange={field.onChange} value={field.value} />
                                <span className={cx('form-group__error')}>
                                    {blogForm.formState.errors?.content?.message}
                                </span>
                            </div>
                        )}
                    />

                    <div className={cx('form_footer')}>
                        <Button type='button' variant='neutral' outline onClick={() => setIsPreviewOpen(true)}>
                            Preview
                        </Button>
                        <Button
                            variant='primary'
                            type='submit'
                            loading={submitFormCreatePending || submitFormUpdatePending}
                        >
                            {isAddMode ? 'Public' : 'Save'}
                        </Button>
                    </div>
                </form>
            )}
            {isLoading && <SkeletonBlogCart />}

            {/* Modal Preview */}
            <Modal
                isOpen={isPreviewOpen}
                onRequestClose={() => setIsPreviewOpen(false)}
                overlayClassName={cx('modalOverlay')}
                className={cx('modal')}
            >
                <div className={cx('modalContent')}>
                    <h2 className={cx('modal__heading')}>Preview Post</h2>
                    <div
                        dangerouslySetInnerHTML={{ __html: getContentHtml() }}
                        className={cx('previewContent', 'ql-editor htmlConverter ')}
                    />
                    <Button variant='neutral' onClick={() => setIsPreviewOpen(false)}>
                        Close
                    </Button>
                </div>
            </Modal>
        </div>
    )
}

export default BlogEditor
