import { Outlet } from 'react-router-dom'
import classNames from 'classnames/bind'
import { MdCategory } from 'react-icons/md'

import TabBar from 'src/components/TabBar'
import SkeletonTabBar from 'src/components/SkeletonTabBar'

import styles from './Category.module.scss'
import useCategoryTabs from 'src/hooks/useCategoryTabs'

const cx = classNames.bind(styles)

function Category() {
    const { categories, isLoading } = useCategoryTabs()

    return (
        <>
            <h1 className={cx('heading')}>
                Category
                <span>
                    <MdCategory />
                </span>
            </h1>

            {isLoading || categories.length <= 1 ? (
                <SkeletonTabBar />
            ) : (
                <TabBar typeTab='NavLink' tabs={categories} idIndexDefault='-1' />
            )}

            <Outlet />
        </>
    )
}

export default Category
