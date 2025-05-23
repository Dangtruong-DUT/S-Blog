import classNames from 'classnames/bind'
import styles from './SingleSelectCategory.module.scss'
import { useQuery } from '@tanstack/react-query'
import blogApi from 'src/apis/blog.api'

const cx = classNames.bind(styles)

interface SingleSelectCategoryProps {
    selectedCategory: string
    onChange: (selected: string) => void
}

export default function SingleSelectCategory({ selectedCategory, onChange }: SingleSelectCategoryProps) {
    const selectCategory = (category: string) => {
        const isSelected = selectedCategory == category
        if (isSelected) {
            onChange('')
        } else {
            onChange(category)
        }
    }

    const { data, isLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: blogApi.getCategories
    })

    const categories = data?.data.data || []

    return (
        <>
            {isLoading && (
                <div className={cx('skeleton-container')}>
                    <div className={cx('skeleton-btn')}></div>
                    <div className={cx('skeleton-btn', 'small')}></div>
                    <div className={cx('skeleton-btn')}></div>
                </div>
            )}
            {!isLoading && (
                <div className={cx('container')}>
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className={cx('category', { selected: selectedCategory == category.id })}
                            onClick={() => selectCategory(category.id)}
                        >
                            {category.name}
                        </div>
                    ))}
                </div>
            )}
        </>
    )
}
