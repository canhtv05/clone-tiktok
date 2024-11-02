import classNames from 'classnames/bind';
import styles from './Modal.module.scss';
import PropTypes from 'prop-types';

const cx = classNames.bind(styles);

function Modal({ children, isOpen, onClose }) {
    return isOpen && <div className={cx('wrapper')}>{children}</div>;
}

Modal.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Modal;
