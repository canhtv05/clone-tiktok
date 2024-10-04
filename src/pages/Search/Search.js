import classNames from 'classnames/bind';
import styles from './Search.module.scss';
import { useLocation } from 'react-router-dom';

const cx = classNames.bind(styles);

function Search() {
    const location = useLocation();
    const params = new URLSearchParams(location.search);

    const value = params.get('q');

    return (
        <div className={cx('wrapper')}>
            <h2>Search page</h2>
            <h2>{value}</h2>
        </div>
    );
}

export default Search;
