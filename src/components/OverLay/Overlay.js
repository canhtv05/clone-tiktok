import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './Overlay.module.scss';
import { forwardRef } from 'react';

const cx = classNames.bind(styles);

const Overlay = forwardRef(({ children, isShowModal }, ref) => {
    return (
        <div className={cx('overlay', { show: isShowModal, hide: !isShowModal })} ref={ref}>
            <div className={cx('center-wrapper')}>{children}</div>
        </div>
    );
});

Overlay.propTypes = {
    children: PropTypes.node.isRequired,
    isShowModal: PropTypes.bool.isRequired,
};

export default Overlay;
