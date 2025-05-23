import classNames from 'classnames/bind'
import styles from './Skeleton.module.scss'

const cx = classNames.bind(styles)

const Skeleton = () => {
    return (
        <div role='status' className={cx('skeleton')}>
            <div className={cx('skeleton__line', 'skeleton__line--w-48', 'skeleton__line--mb-4')}></div>
            <div className={cx('skeleton__line', 'skeleton__line--w-360', 'skeleton__line--mb-2_5')}></div>
            <div className={cx('skeleton__line', 'skeleton__line--mb-2_5')}></div>
            <div className={cx('skeleton__line', 'skeleton__line--w-330', 'skeleton__line--mb-2_5')}></div>
            <div className={cx('skeleton__line', 'skeleton__line--w-300', 'skeleton__line--mb-2_5')}></div>
            <div className={cx('skeleton__line', 'skeleton__line--w-360')}></div>
            <div className={cx('skeleton__line', 'skeleton__line--w-360')}></div>
        </div>
    )
}

export default Skeleton
