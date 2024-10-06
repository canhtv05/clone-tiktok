import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './Popper.module.scss';
import { TopArrowIcon } from '../Icons';

const cx = classNames.bind(styles);

function Wrapper({ children, className, arrow = false, offsetY = -3, offsetX = 15 }) {
    return (
        <div className={cx('wrapper', className)}>
            {arrow && <TopArrowIcon style={{ top: offsetY, right: offsetX }} className={cx('top-arrow')} />}
            {children}
        </div>
    );
}

Wrapper.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    arrow: PropTypes.bool,
    offsetX: PropTypes.number,
    offsetY: PropTypes.number,
};

export default Wrapper;
