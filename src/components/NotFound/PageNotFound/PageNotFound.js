import classNames from 'classnames/bind';
import styles from './PageNotFound.module.scss';
import HeaderPageNotFound from './HeaderPageNotFound';
import FooterPageNotFound from './FooterPageNotFound';

const cx = classNames.bind(styles);

function PageNotFound() {
    return (
        <div className={cx('wrapper')}>
            <HeaderPageNotFound />
            <FooterPageNotFound />
        </div>
    );
}

export default PageNotFound;
