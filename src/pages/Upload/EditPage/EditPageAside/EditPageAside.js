import classNames from 'classnames/bind';
import styles from './EditPageAside.module.scss';

const cx = classNames.bind(styles);

function EditPageAside() {
    return (
        <div className={cx('container')}>
            <div className={cx('title')}>Details</div>
        </div>
    );
}

export default EditPageAside;
