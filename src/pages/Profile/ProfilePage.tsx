import styles from './ProfilePage.module.scss'
import classNames from 'classnames/bind'
import Profile from './components/Profile'
import TabBar from 'src/components/TabBar'
import { CiGrid31, CiHeart } from 'react-icons/ci'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import userApi from 'src/apis/user.api'
import SkeletonProfile from './components/SkeletonProfile'
import SkeletonTabBar from 'src/components/SkeletonTabBar'
import { useMemo, useState } from 'react'
import BlogList from './components/InfiniteScrollBlog/InfiniteScrollBlog'
import { useFollowUser, useUnfollowUser } from 'src/hooks/useFollowUser'
import SEO from 'src/components/SeoHelmet'

const cx = classNames.bind(styles)

const ProfileTab = [
    {
        id: 1,
        name: 'Post',
        icon: <CiGrid31 />
    },
    {
        id: 2,
        name: 'Liked',
        icon: <CiHeart />
    }
]

function ProfilePage() {
    const tabActiveDefault = 1
    const [tabActiveIndex, setTabActiveIndex] = useState<string | number>(tabActiveDefault)
    const [filterParam, setFilterParam] = useState<'all' | 'popular' | 'recent'>('all')
    let { username } = useParams()
    username = username?.slice(1)

    const { data } = useQuery({
        queryKey: [`profile:${username}`],
        queryFn: () => userApi.getProfile(username as string),
        staleTime: 5 * 60 * 1000
    })

    const userData = data?.data.data

    const { follow, loading: followLoading, success: followSuccess } = useFollowUser(userData?.id || '')
    const { unfollow } = useUnfollowUser(userData?.id || '')

    const getIndexTabBar = (id: string | number) => {
        setTabActiveIndex(id)
    }

    const queryConfig = useMemo(() => {
        if (!userData) return {}

        if (tabActiveIndex === 1) {
            return {
                author: userData.id,
                filter: filterParam
            }
        } else if (tabActiveIndex === 2) {
            return {
                liked: true
            }
        }

        return {}
    }, [tabActiveIndex, userData, filterParam])
    return (
        <>
            {userData && (
                <SEO
                    title={`${userData.first_name} ${userData.last_name} | S-Blog`}
                    description={`Khám phá trang cá nhân của ${userData.first_name} ${userData.last_name} – ${userData.bio || 'một người dùng nổi bật trên S-Blog'}. Đã nhận được ${userData.total_likes ?? 0} lượt thích và ${userData.followers_count ?? 0} lượt theo dõi từ cộng đồng.`}
                    path={`/@${username}`}
                    image={userData.avatar || ''}
                    type='profile'
                    keywords={`${userData.first_name} ${userData.last_name}, profile, tác giả, S-Blog, blogger, ${userData.bio ? 'chuyên gia, ' : ''}viết blog`}
                    author={`${userData.first_name} ${userData.last_name}`}
                />
            )}
            <div className={cx('container')}>
                <div className={cx('profile')}>
                    {userData ? (
                        <Profile
                            userData={userData}
                            onFollow={follow}
                            onUnfollow={unfollow}
                            followLoading={followLoading}
                            followSuccess={followSuccess}
                        />
                    ) : (
                        <SkeletonProfile />
                    )}
                </div>

                <div className={cx('tabs-wrapper')}>
                    {userData ? (
                        <>
                            <TabBar
                                getActiveIndex={getIndexTabBar}
                                typeTab='button'
                                tabs={ProfileTab}
                                idIndexDefault={tabActiveDefault}
                            />
                            {tabActiveIndex === 1 && (
                                <div className={cx('filters')}>
                                    <button
                                        className={cx('filters__item', {
                                            'filters__item--active': filterParam === 'all'
                                        })}
                                        onClick={() => setFilterParam('all')}
                                    >
                                        All
                                    </button>
                                    <button
                                        className={cx('filters__item', {
                                            'filters__item--active': filterParam === 'popular'
                                        })}
                                        onClick={() => setFilterParam('popular')}
                                    >
                                        Popular
                                    </button>
                                    <button
                                        className={cx('filters__item', {
                                            'filters__item--active': filterParam === 'recent'
                                        })}
                                        onClick={() => setFilterParam('recent')}
                                    >
                                        Recent
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <SkeletonTabBar />
                    )}
                </div>

                <div className={cx('content')}>
                    <BlogList queryConfig={queryConfig} queryKey={`@${username}/blogs/${tabActiveIndex}`} />
                </div>
            </div>
        </>
    )
}

export default ProfilePage
