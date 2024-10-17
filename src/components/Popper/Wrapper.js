import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './Popper.module.scss';
import { TopArrowIcon } from '../Icons';
import { forwardRef } from 'react';

const cx = classNames.bind(styles);

const Wrapper = forwardRef(({ children, className, arrow = false, offsetY = -3, offsetX = 15 }, ref) => {
    return (
        <div className={cx('wrapper', className)} ref={ref}>
            {arrow && <TopArrowIcon style={{ top: offsetY, right: offsetX }} className={cx('top-arrow')} />}
            {children}
        </div>
    );
});

Wrapper.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    arrow: PropTypes.bool,
    offsetX: PropTypes.number,
    offsetY: PropTypes.number,
};

export default Wrapper;
