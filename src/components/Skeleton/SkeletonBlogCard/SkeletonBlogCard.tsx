import SkeletonImage from '../SkeletonImage'
import SkeletonLine from '../SkeletonLine'
import SkeletonWrapper from '../SkeletonWrapper'

const SkeletonBlogCard = () => {
    return (
        <SkeletonWrapper>
            <SkeletonImage />
            <SkeletonLine />
            <SkeletonLine />
            <SkeletonLine />
        </SkeletonWrapper>
    )
}

export default SkeletonBlogCard
