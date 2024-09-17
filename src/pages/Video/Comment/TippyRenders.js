import { TopArrowIcon } from '~/components/Icons';
import { menuItem, menuShareItem, menuEllipsis } from './MenuItem';
import classNames from 'classnames/bind';
import styles from './Comment.module.scss';

const cx = classNames.bind(styles);

export const renderTippy = () => (
    <div className={cx('menu')}>
        <ul>
            {menuItem.map((item, index) => (
                <li key={index} className={cx('menu-item', { separate: item?.separate })}>
                    <span className={cx('title')}>{item.title}</span>
                </li>
            ))}
        </ul>
        <TopArrowIcon className={cx('top-arrow')} />
    </div>
);

export const renderShareTippy = () => (
    <div className={cx('menu')}>
        <ul>
            {menuShareItem.map((item, index) => (
                <li key={index} className={cx('menu-item', { share: true })}>
                    {item.icon}
                    <span className={cx('title-share')}>{item.title}</span>
                </li>
            ))}
        </ul>
        <TopArrowIcon className={cx('top-arrow')} />
    </div>
);

export const renderEllipsisTippy = (currentUserComment, onDelete) => (
    <div className={cx('menu')}>
        <ul>
            {menuEllipsis(currentUserComment).map((item, index) => (
                <li
                    onClick={currentUserComment ? onDelete : undefined}
                    key={index}
                    className={cx('menu-item', { separate: item?.separate, 'ellipsis-menu': true })}
                >
                    <span style={{ marginRight: 6 }}>{item.icon}</span>
                    <span style={{ fontSize: 16, lineHeight: '24px' }} className={cx('title')}>
                        {item.title}
                    </span>
                </li>
            ))}
        </ul>
        <TopArrowIcon className={cx('top-arrow')} />
    </div>
);
