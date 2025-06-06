import classNames from 'classnames/bind'
import Tippy from '@tippyjs/react/headless'
import { Link, useNavigate } from 'react-router-dom'
import { useCallback, useContext, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import styles from './BlogCard.module.scss'
import { Blog } from 'src/types/blog.type'
import { generateNameId } from 'src/utils/common.util'
import { AppContext } from 'src/contexts/app.context'
import blogApi from 'src/apis/blog.api'
import userApi from 'src/apis/user.api'
import PopperWrapper from '../Popper'
import { FiMoreHorizontal } from 'react-icons/fi'
import ConfirmDeleteModal from './components/ConfirmDeleteModal'
import AuthorInfo from './components/AuthorInfo'
import ActionMenu from './components/ActionMenu'
import { SkeletonLine, SkeletonWrapper } from '../Skeleton'
import useIsMobile from 'src/hooks/useIsMobile'

const cx = classNames.bind(styles)

interface BlogCardProps {
    blog: Blog
}

function BlogCard({ blog }: BlogCardProps) {
    const { profile } = useContext(AppContext)
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const isMobile = useIsMobile(768) // Sử dụng hook useIsMobile để kiểm tra thiết bị

    const [isShowDeleteModal, setShowDeleteModal] = useState(false)
    const [isMenuOpen, setMenuOpen] = useState(false)

    const isAuthor = profile?.id === blog.author_id

    const { data: userRes, isLoading } = useQuery({
        queryKey: [`profile:${blog.author_id}`],
        queryFn: () => userApi.getProfile(blog.author_id!),
        staleTime: 5 * 60 * 1000
    })

    const { data: categoryRes } = useQuery({
        queryKey: ['category', blog.category],
        queryFn: () => blogApi.getCategoryById(blog.category!)
    })

    const userData = userRes?.data.data
    const categoryData = categoryRes?.data.data

    const deleteMutation = useMutation({
        mutationFn: blogApi.deleteBlog
    })

    const handleStopPropagation = useCallback((e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
    }, [])

    const handleDeletePost = useCallback(() => {
        deleteMutation.mutate(blog.id, {
            onSuccess: (res) => {
                setShowDeleteModal(false)
                toast.dismiss()
                toast.success(res.data.message)
                queryClient.invalidateQueries({ queryKey: ['blogList'] })
            },
            onError: (err) => {
                toast.dismiss()
                toast.error(err.message)
            }
        })
    }, [blog.id, deleteMutation, queryClient])

    const handleConfirmDelete = useCallback(
        (e: React.MouseEvent) => {
            handleStopPropagation(e)
            setMenuOpen(false)
            setShowDeleteModal(true)
        },
        [handleStopPropagation]
    )

    const handleViewProfile = useCallback(
        (e: React.MouseEvent) => {
            handleStopPropagation(e)
            navigate(`/@${blog.id}`)
        },
        [blog.id, handleStopPropagation, navigate]
    )

    const toggleModalDeletePostVisibility = useCallback(() => {
        setShowDeleteModal((prev) => !prev)
    }, [])

    // Xử lý sự kiện touch cho thiết bị cảm ứng
    const handleTouchMove = useCallback(
        (e: React.TouchEvent) => {
            // Ngăn chặn scroll nếu đang tương tác với menu
            if (isMenuOpen) {
                e.stopPropagation()
            }
        },
        [isMenuOpen]
    )

    return (
        <>
            <Link to={`/blogs/${generateNameId({ name: blog.title, id: blog.id })}`}>
                <article
                    className={cx('BlogCardWrapper', { 'touch-feedback': isMobile })}
                    onTouchMove={handleTouchMove}
                >
                    <div className={cx('featureImageWrapper')}>
                        {isAuthor && (
                            <Tippy
                                visible={isMenuOpen}
                                onClickOutside={() => setMenuOpen(false)}
                                interactive
                                placement={isMobile ? 'bottom' : 'bottom-start'}
                                appendTo='parent'
                                render={(attrs) => (
                                    <div className={cx('more-action-blog')} tabIndex={-1} {...attrs}>
                                        <PopperWrapper className={cx('menu-wrapper')}>
                                            <ActionMenu blogId={blog.id} onDelete={handleConfirmDelete} />
                                        </PopperWrapper>
                                    </div>
                                )}
                            >
                                <button
                                    className={cx('more-button')}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        setMenuOpen(!isMenuOpen)
                                    }}
                                    aria-label='Thêm tùy chọn'
                                >
                                    <FiMoreHorizontal size={isMobile ? '2rem' : '2.5rem'} />
                                </button>
                            </Tippy>
                        )}
                        <img src={blog.featured_image} alt={blog.title} className={cx('blog__image')} loading='lazy' />
                    </div>
                    {isLoading ? (
                        <SkeletonWrapper>
                            <SkeletonLine height={18} width={150} />
                        </SkeletonWrapper>
                    ) : (
                        <AuthorInfo
                            userData={userData}
                            categoryName={categoryData?.name}
                            onClickProfile={handleViewProfile}
                        />
                    )}

                    <h2 className={cx('blog__title')}>{blog.title}</h2>
                    <p className={cx('blog__subtitle')}>{blog.subtitle}</p>
                </article>
            </Link>
            <ConfirmDeleteModal
                isLoading={deleteMutation.isPending}
                isOpen={isShowDeleteModal}
                onCancel={toggleModalDeletePostVisibility}
                onConfirm={handleDeletePost}
            />
        </>
    )
}

export default BlogCard
