import classNames from 'classnames/bind'
import styles from './MultiSelectCategory.module.scss'
import { useQuery } from '@tanstack/react-query'
import blogApi from 'src/apis/blog.api'

const cx = classNames.bind(styles)

interface MultiSelectCategoryProps {
    selectedCategories: string[]
    onChange: (selected: string[]) => void
}

export default function MultiSelectCategory({ selectedCategories, onChange }: MultiSelectCategoryProps) {
    const toggleCategory = (category: string) => {
        const isSelected = selectedCategories.includes(category)
        let updatedCategories

        if (isSelected) {
            updatedCategories = selectedCategories.filter((c) => c !== category)
        } else {
            updatedCategories = [...selectedCategories, category]
        }

        onChange(updatedCategories)
    }

    const { data, isLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: blogApi.getCategories
    })

    const categories = data?.data.data.categories || []
    return (
        <>
            {isLoading && (
                <div className={cx('skeleton-container')}>
                    <div className={cx('skeleton-btn')}></div>
                    <div className={cx('skeleton-btn', 'small')}></div>
                    <div className={cx('skeleton-btn')}></div>
                </div>
            )}{' '}
            {!isLoading && (
                <div className={cx('container')}>
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className={cx('category', { selected: selectedCategories.includes(category.name) })}
                            onClick={() => toggleCategory(category.name)}
                        >
                            {category.name}
                        </div>
                    ))}
                </div>
            )}
        </>
    )
}
