import React from 'react'
import classNames from 'classnames/bind'
import AccountItem from '../AccountItem'
import { User } from 'src/types/user.type'
import styles from './SearchBar.module.scss'

const cx = classNames.bind(styles)

const AccountResults: React.FC<{ users: User[] }> = React.memo(({ users }) => (
    <section>
        <h4 className={cx('search-title')}>Accounts</h4>
        <ul>
            {users.map((user) => (
                <li key={user.id}>
                    <AccountItem
                        avatarSize='40px'
                        avatar={user.avatar}
                        title={user.email}
                        nameAccount={`${user.first_name} ${user.last_name}`}
                        verified={false}
                        to={`/@${user.id}`}
                    />
                </li>
            ))}
        </ul>
    </section>
))

export default AccountResults
