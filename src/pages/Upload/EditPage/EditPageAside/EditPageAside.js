import classNames from 'classnames/bind';
import styles from './EditPageAside.module.scss';
import EditPageDetailsAside from './EditPageDetailsAside';
import EditPageSettingsAside from './EditPageSettingsAside';

const cx = classNames.bind(styles);

function EditPageAside() {
    return (
        <div className={cx('container')}>
            <EditPageDetailsAside />
            <EditPageSettingsAside />
        </div>
    );
}

export default EditPageAside;
