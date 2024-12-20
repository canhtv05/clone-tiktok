import classNames from 'classnames/bind';
import styles from './EditPage.module.scss';
import EditPageHeader from './EditPageHeader';
import EditPageAside from './EditPageAside';
import EditPageArticle from './EditPageArticle';

const cx = classNames.bind(styles);

function EditPage() {
    return (
        <div className={cx('container')}>
            <EditPageHeader />
            <div className={cx('wrapper-content')}>
                <div className={cx('edit-aside')}>
                    <EditPageAside />
                </div>
                <div className={cx('edit-article')}>
                    <EditPageArticle />
                </div>
            </div>
        </div>
    );
}

export default EditPage;
