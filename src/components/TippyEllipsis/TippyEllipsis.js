import classNames from 'classnames/bind';
import TippyHeadless from '@tippyjs/react/headless';
import { useCallback, useEffect, useRef } from 'react';
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
    position = 'bottom',
    arrow = false,
    setScrollToggle,
    scrollToggle,
}) {
    const inputRef = useRef();

    useEffect(() => {
        if (scrollToggle && inputRef.current) {
            inputRef.current.checked = true;
        }
    }, [scrollToggle, inputRef]);

    const handleScrollToggle = useCallback(
        (e) => {
            setScrollToggle(e.target.checked);
        },
        [setScrollToggle],
    );

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
                            {item.toggle && (
                                <div className={cx('toggle')}>
                                    <input
                                        ref={inputRef}
                                        type="checkbox"
                                        className={cx('toggle-input')}
                                        id={cx('toggle-input')}
                                        onChange={handleScrollToggle}
                                    />
                                    <label htmlFor={cx('toggle-input')} className={cx('toggle-label')}></label>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
                {arrow && <TopArrowIcon className={cx('top-arrow')} />}
            </div>
        );
    };
    return (
        <div>
            <TippyHeadless
                delay={[delayIn, delayOut]}
                offset={[offsetX, offsetY]}
                placement={position}
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
    setScrollToggle: PropTypes.func,
    scrollToggle: PropTypes.bool,
};

export default TippyEllipsis;
