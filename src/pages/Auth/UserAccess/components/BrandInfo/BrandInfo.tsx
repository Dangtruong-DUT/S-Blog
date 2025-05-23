import React from 'react'
import classNames from 'classnames/bind'
import styles from './BrandInfo.module.scss'

const cx = classNames.bind(styles)

const BrandInfo: React.FC = React.memo(() => (
    <div className={cx('brand-info')}>
        <h2 className={cx('team-heading')}>BTB Team</h2>
        <p className={cx('team-description')}>
            "At 'S Blog', we provide an easy-to-use platform for you to create and share your stories with the world."
        </p>
    </div>
))

export default BrandInfo

// Responsive: Đã sử dụng rem, max-width, text-align center, padding phù hợp trong BrandInfo.module.scss.
// Nếu muốn responsive tốt hơn nữa, có thể thêm media query vào BrandInfo.module.scss như sau:
//
// @media (max-width: 600px) {
//   .brand-info { padding: 0 8px; }
//   .team-heading { font-size: 1.6rem; }
//   .team-description { font-size: 1.1rem; }
// }
