import classNames from 'classnames/bind'
import Modal from 'react-modal'
import { FiEdit, FiMoreHorizontal } from 'react-icons/fi'
import Tippy from '@tippyjs/react/headless'
import { Link, useNavigate } from 'react-router-dom'
import styles from './BlogCart.module.scss'
import { Blog } from 'src/types/blog.type'
import { generateNameId } from 'src/utils/common.util'
import { useContext, useState } from 'react'
import PopperWrapper from '../Popper'
import { MdDeleteOutline } from 'react-icons/md'
import { useMutation } from '@tanstack/react-query'
import blogApi from 'src/apis/blog.api'
import { toast } from 'react-toastify'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { AppContext } from 'src/contexts/app.context'
import ProfileCard from '../ProfileCard/ProfileCard'

const cx = classNames.bind(styles)
interface blogCartProps {
    blog: Blog
}
function BlogCart({ blog }: blogCartProps) {
    const { profile } = useContext(AppContext)
    const navigate = useNavigate()
    const [isShowModelDelete, setShowModelDelete] = useState<boolean>(false)
    const [isMenuOpen, setMenuOpen] = useState(false)
    const isAuthor = profile?.username == blog.author

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleStopPropagation = (e: React.MouseEvent<any, MouseEvent>) => {
        e.preventDefault()
        e.stopPropagation()
    }
    const handleConfirmDelete = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        handleStopPropagation(e)
        setMenuOpen(false)
        setShowModelDelete(true)
    }

    const handleViewProfile = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        handleStopPropagation(e)
        navigate(`/@${blog.author}`)
    }
    const deletePostMutation = useMutation({
        mutationFn: blogApi.deleteBlog
    })
    const handleDeletePost = () => {
        deletePostMutation.mutate(blog.id, {
            onSuccess: (res) => {
                setShowModelDelete(false)
                toast.dismiss()
                toast.success(res.data.message)
            },
            onError: (res) => {
                toast.dismiss()
                toast.error(res.message)
            }
        })
    }
    const renderMenuAction = () => {
        return (
            <div className={cx('menu-action')}>
                <Link to={`/blogs/${blog.id}/edit`} className={cx('menu-action__button')}>
                    <FiEdit size={'2.1rem'} />
                    <span>Edit</span>
                </Link>
                <button className={cx('menu-action__button')} onClick={handleConfirmDelete}>
                    <MdDeleteOutline size={'2.1rem'} />
                    <span>Delete</span>
                </button>
            </div>
        )
    }
    const renderModalDeletePost = () => {
        return (
            <div className={cx('modal__content')}>
                <p className={cx('modal__title')}>Are you sure you want to delete this Post?</p>
                <div className={cx('modal__actions')}>
                    <button className={cx('modal__button')} onClick={handleDeletePost}>
                        {deletePostMutation.isPending ? (
                            <AiOutlineLoading3Quarters className={cx('loader')} size={'2.4rem'} />
                        ) : (
                            <span>Delete</span>
                        )}
                    </button>
                    <button
                        className={cx('modal__button')}
                        onClick={() => {
                            setShowModelDelete(false)
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        )
    }

    const renderModalProfileCart = () => {
        return (
            <div className={cx('modal__content')} onClick={(e) => handleStopPropagation(e)}>
                <ProfileCard author={blog.author} />
            </div>
        )
    }
    return (
        <>
            <Link to={`${'/blogs/'}${generateNameId({ name: blog.title, id: blog.id })}`}>
                <article className={cx('BlogCartWrapper')}>
                    <div className={cx('featureImageWrapper')}>
                        {isAuthor && (
                            <Tippy
                                visible={isMenuOpen}
                                onClickOutside={() => setMenuOpen(false)}
                                interactive
                                placement='bottom-start'
                                appendTo='parent'
                                render={(attrs) => (
                                    <div className={cx('more-action-blog')} tabIndex={-1} {...attrs}>
                                        <PopperWrapper className={cx('menu-wrapper')}>
                                            {renderMenuAction()}
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
                                >
                                    <FiMoreHorizontal size={'2.5rem'} />
                                </button>
                            </Tippy>
                        )}
                        <img src={blog.feature_image} alt={blog.title} className={cx('blog__image')} />
                    </div>
                    <h3 className={cx('blog__author')}>
                        BY
                        <strong>
                            <Tippy
                                interactive
                                placement='bottom-start'
                                appendTo='parent'
                                render={(attrs) => (
                                    <div className={cx('more-action-blog')} tabIndex={-1} {...attrs}>
                                        <PopperWrapper className={cx('menu-wrapper')}>
                                            {renderModalProfileCart()}
                                        </PopperWrapper>
                                    </div>
                                )}
                            >
                                <span onClick={handleViewProfile} className={cx('link')}>
                                    {blog.author}
                                </span>
                            </Tippy>
                        </strong>
                        IN
                        <strong>{blog.categories[0]}</strong>
                    </h3>
                    <h2 className={cx('blog__title')}>{blog.title}</h2>
                    <p className={cx('blog__subtitle')}>{blog.sub_title}</p>
                </article>
            </Link>
            <Modal
                isOpen={isShowModelDelete}
                onRequestClose={() => {
                    setShowModelDelete(false)
                }}
                overlayClassName={cx('modal__overlay')}
                className={cx('modal')}
            >
                {renderModalDeletePost()}
            </Modal>
        </>
    )
}

export default BlogCart
