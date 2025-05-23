import React from 'react'
import classNames from 'classnames/bind'
import styles from './Thumbnail.module.scss'
import thumbnail from 'src/assets/images/Thumbnail.png'

const cx = classNames.bind(styles)

const Thumbnail: React.FC = React.memo(() => <img src={thumbnail} alt='Thumbnail' className={cx('thumbnail')} />)

export default Thumbnail
