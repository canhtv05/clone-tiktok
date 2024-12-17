import classNames from 'classnames/bind';
import styles from './EditPage.module.scss';
import EditPageHeader from './EditPageHeader';

const cx = classNames.bind(styles);

function EditPage() {
    return (
        <div className={cx('container')}>
            <EditPageHeader />
        </div>
    );
}

export default EditPage;
