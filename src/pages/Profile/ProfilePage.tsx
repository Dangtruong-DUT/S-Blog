import styles from './ProfilePage.module.scss'
import classNames from 'classnames/bind'
import Profile from './components/Profile'
import useQueryConfig from 'src/hooks/useQueryConfig'
import TabBar from 'src/components/TabBar'
import { CiGrid31, CiHeart } from 'react-icons/ci'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import userApi from 'src/apis/user.api'
import SkeletonProfile from './components/SkeletonProfile'
import SkeletonTabBar from 'src/components/SkeletonTabBar'
import { useState } from 'react'
import BlogList from './components/InfiniteScrollBlog/InfiniteScrollBlog'

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
    const queryConfig = useQueryConfig()
    let { username } = useParams()
    username = username?.slice(1)
    const { data } = useQuery({
        queryKey: [`profile: ${username}`],
        queryFn: () => userApi.getProfile(username as string)
    })
    const userData = data?.data.data
    const getIndexTabBar = (id: string | number) => {
        setTabActiveIndex(id)
    }
    return (
        <div className={cx('container')}>
            <div className={cx('profile')}>{userData ? <Profile userData={userData} /> : <SkeletonProfile />}</div>
            <div className={cx('tabs-wrapper')}>
                {userData ? (
                    <>
                        <TabBar
                            getActiveIndex={getIndexTabBar}
                            typeTab='button'
                            tabs={ProfileTab}
                            idIndexDefault={tabActiveDefault}
                        />
                        {tabActiveIndex == 1 && (
                            <div className={cx('filters')}>
                                <button
                                    className={cx('filters__item', { 'filters__item--active': filterParam == 'all' })}
                                    onClick={() => setFilterParam('all')}
                                >
                                    All
                                </button>
                                <button
                                    className={cx('filters__item', {
                                        'filters__item--active': filterParam == 'popular'
                                    })}
                                    onClick={() => setFilterParam('popular')}
                                >
                                    Popular
                                </button>
                                <button
                                    className={cx('filters__item', {
                                        'filters__item--active': filterParam == 'recent'
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
                <BlogList queryConfig={queryConfig} queryKey={`@${username}/blogs`} />
            </div>
        </div>
    )
}

export default ProfilePage
