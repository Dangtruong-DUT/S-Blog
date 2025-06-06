import { useContext, useEffect, useRef, useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import 'highlight.js/styles/atom-one-dark.css'
import Modal from 'react-modal'
import Button from 'src/components/Button'
import classNames from 'classnames/bind'
import styles from './CreateBlog.module.scss'
import { blogSchema, BlogSchemaType } from 'src/utils/rules.util'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { convertToHtml } from 'src/utils/convertQuillToHTML'
import hljs from 'highlight.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import blogApi from 'src/apis/blog.api'
import { useMatch, useNavigate, useParams } from 'react-router-dom'
import { routes } from 'src/config'
import { toast } from 'react-toastify'
import uploadApi from 'src/apis/upload.api'
import handleFormError from 'src/utils/handleFormError.util'
import { CreateBlogReqBody, UpdateBlogReqBody } from 'src/types/blog.type'
import { SkeletonBlogCard } from 'src/components/Skeleton'
import { IoArrowBackCircle } from 'react-icons/io5'
import { AppContext } from 'src/contexts/app.context'
import SEO from 'src/components/SeoHelmet'
import CategorySelect from './components/CategorySelect'
import ThumbnailUpload from './components/ThumbnailUpload'
import TitleInput from './components/TitleInput'
import DescriptionInput from './components/DescriptionInput'
import ContentEditor from './components/ContentEditor'
import FormFooter from './components/FormFooter'
import PreviewModal from './components/PreviewModal'
import ChatAIAssistant from 'src/components/ChatAIAssistant'
import { HiSparkles } from 'react-icons/hi2'
import { mergeQuillDeltas } from 'src/utils/convertMarkdownToQuill'

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
    const [isChatAIOpen, setIsChatAIOpen] = useState(false)
    const navigate = useNavigate()
    const handleBackScreen = () => {
        navigate(-1)
    }
    const { profile } = useContext(AppContext)
    const blogForm = useForm<FormData>({
        defaultValues: {
            content: '',
            subtitle: '',
            title: '',
            category: '',
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
            const hasPermission = blog.author_id != profile?.id
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
            blogForm.setValue('subtitle', blog.subtitle)
            blogForm.setValue('feature_image', blog.featured_image)
            blogForm.setValue('category', blog.category)
        }
    }, [blog, blogForm])

    // Enhanced ChatAI helper functions with flexible content insertion
    const handleApplyToField = (
        field: 'title' | 'description' | 'content',
        value: string,
        mode: 'replace' | 'append' = 'replace'
    ) => {
        switch (field) {
            case 'title':
                blogForm.setValue('title', value)
                break
            case 'description':
                if (mode === 'append') {
                    const currentDesc = blogForm.watch('subtitle') || ''
                    blogForm.setValue('subtitle', currentDesc + ' ' + value)
                } else {
                    blogForm.setValue('subtitle', value)
                }
                break
            case 'content':
                if (mode === 'append') {
                    const currentContent = blogForm.watch('content') || ''
                    const newDeltas = mergeQuillDeltas(currentContent, value)
                    blogForm.setValue('content', newDeltas)
                } else {
                    blogForm.setValue('content', value)
                }

                break
        }
    }

    const getFormData = () => {
        // Get content as plain text for AI analysis
        let contentText = ''
        if (quillRef.current) {
            const quillEditor = quillRef.current.getEditor()
            contentText = quillEditor.getText()
        } else {
            // Fallback: try to parse Delta JSON to text
            const contentDelta = blogForm.watch('content') as string
            if (contentDelta) {
                try {
                    const delta = JSON.parse(contentDelta) as { ops?: Array<{ insert?: string }> }
                    contentText = delta.ops?.map((op) => op.insert || '').join('') || ''
                } catch {
                    contentText = contentDelta
                }
            }
        }

        return {
            title: blogForm.watch('title'),
            description: blogForm.watch('subtitle'), // subtitle is the description field
            content: contentText,
            category: blogForm.watch('category')
        }
    }

    const handleOnSubmit = blogForm.handleSubmit(async (data) => {
        let thumbnail_url
        if (fileImage) {
            try {
                const form = new FormData()
                form.append('image', fileImage)
                const response = await uploadImageMutation.mutateAsync(form)
                thumbnail_url = response.data.data.url
            } catch (error) {
                console.log(error)
                toast.error('An unknown error has occurred. Please try again later.')
            }
        }

        if (isAddMode) {
            const body: CreateBlogReqBody = {
                category: data.category,
                content: data.content,
                featured_image: thumbnail_url || data.feature_image,
                subtitle: data.subtitle,
                title: data.title,
                status: 'published'
            }

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
            const body: UpdateBlogReqBody = {
                category: data.category,
                content: data.content,
                featured_image: thumbnail_url || data.feature_image,
                subtitle: data.subtitle,
                title: data.title,
                status: 'published'
            }

            await updateBlogMutation(
                { body: body, id: id as string },
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
        <>
            <SEO
                title='Tạo bài viết mới | S-Blog'
                description='Tạo và chia sẻ bài viết, blog mới trên S-Blog. Nền tảng chia sẻ tri thức, công nghệ, lập trình, phát triển bản thân và nhiều lĩnh vực khác.'
                path='/blogs/create'
            />
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
                        <CategorySelect control={blogForm.control} errors={blogForm.formState.errors} />
                        <Controller
                            control={blogForm.control}
                            name='feature_image'
                            render={({ field }) => (
                                <ThumbnailUpload
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={blogForm.formState.errors?.feature_image?.message ?? ''}
                                    setFileImage={setFileImage}
                                />
                            )}
                        />{' '}
                        <TitleInput
                            register={blogForm.register}
                            error={blogForm.formState.errors?.title?.message || ''}
                        />
                        <DescriptionInput
                            register={blogForm.register}
                            error={blogForm.formState.errors?.subtitle?.message ?? ''}
                        />
                        <Controller
                            control={blogForm.control}
                            name='content'
                            render={({ field }) => (
                                <ContentEditor
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={blogForm.formState.errors?.content?.message || ''}
                                    quillRef={quillRef}
                                />
                            )}
                        />
                        <FormFooter
                            isAddMode={isAddMode}
                            loading={submitFormCreatePending || submitFormUpdatePending}
                            onPreview={() => setIsPreviewOpen(true)}
                        />
                    </form>
                )}
                {isLoading && <SkeletonBlogCard />}

                {/* AI Chat Assistant Toggle Button */}
                <button
                    className={cx('ai-toggle-btn')}
                    onClick={() => setIsChatAIOpen(!isChatAIOpen)}
                    title='Open AI Assistant'
                >
                    <HiSparkles />
                </button>

                {/* AI Chat Assistant */}
                <ChatAIAssistant
                    isOpen={isChatAIOpen}
                    onToggle={() => setIsChatAIOpen(!isChatAIOpen)}
                    formData={getFormData()}
                    onApplyToField={handleApplyToField}
                />
                <PreviewModal
                    isOpen={isPreviewOpen}
                    onRequestClose={() => setIsPreviewOpen(false)}
                    getContentHtml={getContentHtml}
                />
            </div>
        </>
    )
}

export default BlogEditor
