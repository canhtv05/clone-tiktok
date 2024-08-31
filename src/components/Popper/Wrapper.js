import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './Popper.module.scss';

const cx = classNames.bind(styles);

function Wrapper({ children, className, arrow = false }) {
    return (
        <div className={cx('wrapper', className)}>
            {arrow && <div className={cx('popper-arrow')}></div>}
            {children}
        </div>
    );
}

Wrapper.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    arrow: PropTypes.bool,
};

export default Wrapper;
