import classNames from 'classnames/bind';
import styles from './Modal.module.scss';
import PropTypes from 'prop-types';

const cx = classNames.bind(styles);

function Modal({ children, onClose }) {
    return (
        <div className={cx('overlay')} onClick={onClose}>
            <div className={cx('modal')} onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
}

Modal.propTypes = {
    children: PropTypes.node.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default Modal;
