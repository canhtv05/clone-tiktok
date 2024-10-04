import classNames from 'classnames/bind';
import TippyHeadless from '@tippyjs/react/headless';
import PropTypes from 'prop-types';
import styles from './TippyEllipsis.module.scss';
import { TopArrowIcon } from '../Icons';

const cx = classNames.bind(styles);

function TippyEllipsis({
    menuItem,
    delayIn = 0,
    delayOut = 200,
    offsetX = -80,
    offsetY = 15,
    children,
    hoverRed = false,
}) {
    const renderTippy = () => {
        return (
            <div className={cx('menu')}>
                <ul>
                    {menuItem.map((item, index) => (
                        <li
                            key={index}
                            className={cx('menu-item', { separate: item?.separate, 'hover-red': hoverRed })}
                        >
                            <span className={cx('span-icon', { 'hover-red': hoverRed })}>{item.icon}</span>
                            <span className={cx('title')}>{item.title}</span>
                        </li>
                    ))}
                </ul>
                <TopArrowIcon className={cx('top-arrow')} />
            </div>
        );
    };
    return (
        <div>
            <TippyHeadless
                delay={[delayIn, delayOut]}
                offset={[offsetX, offsetY]}
                placement="bottom"
                render={renderTippy}
                interactive
            >
                {children}
            </TippyHeadless>
        </div>
    );
}

TippyEllipsis.propTypes = {
    menuItem: PropTypes.arrayOf(
        PropTypes.shape({
            icon: PropTypes.node.isRequired,
            title: PropTypes.string.isRequired,
            separate: PropTypes.bool,
        }),
    ).isRequired,
    delayIn: PropTypes.number,
    delayOut: PropTypes.number,
    offsetX: PropTypes.number,
    offsetY: PropTypes.number,
    hoverRed: PropTypes.bool,
    children: PropTypes.node.isRequired,
};

export default TippyEllipsis;
