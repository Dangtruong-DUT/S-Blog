import { useQuery } from '@tanstack/react-query'
import { Outlet } from 'react-router-dom'
import classNames from 'classnames/bind'
import blogApi from 'src/apis/blog.api'
import TabBar from 'src/components/TabBar'
import styles from './Category.module.scss'
import { MdCategory } from 'react-icons/md'
import { useMemo } from 'react'
import SkeletonTabBar from 'src/components/SkeletonTabBar'

const cx = classNames.bind(styles)
function Category() {
    const { data } = useQuery({
        queryKey: ['categories'],
        queryFn: blogApi.getCategories
    })

    const tabData = useMemo(() => {
        const categories = data?.data?.data?.categories || []

        return [{ id: '-1', name: 'All' }, ...categories]
    }, [data])

    return (
        <>
            <h1 className={cx('heading')}>
                Category
                <span>
                    <MdCategory />
                </span>
            </h1>
            {tabData.length > 1 ? (
                <TabBar typeTab='NavLink' tabs={tabData} idIndexDefault={'-1'} />
            ) : (
                <SkeletonTabBar />
            )}

            <Outlet />
        </>
    )
}

export default Category
