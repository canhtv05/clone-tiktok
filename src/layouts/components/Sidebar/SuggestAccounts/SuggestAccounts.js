import { memo, useCallback, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import styles from './SuggestAccounts.module.scss';
import SuggestAccountItem from './SuggestAccountItem';
import * as getSuggestedUser from '~/services/getSuggestedUser';

const cx = classNames.bind(styles);

function SuggestAccounts({ label }) {
    const [suggestUser, setSuggestUser] = useState([]);
    const [page, setPage] = useState(1);
    const [isEmpty, setIsEmpty] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchApi = useCallback(async () => {
        setLoading(true);
        const res = await getSuggestedUser.getUserSuggested(5, page);
        const timeout = setTimeout(() => {
            if (res && res.length > 0) {
                setSuggestUser((prev) => [...prev, ...res]);
                setIsEmpty(false);
            } else {
                setIsEmpty(true);
            }
            setLoading(false);
        }, 200);

        return () => clearTimeout(timeout);
    }, [page]);

    useEffect(() => {
        fetchApi();
    }, [fetchApi]);

    const handleSeeMore = useCallback(() => {
        if (!isEmpty) {
            setPage((prev) => prev + 1);
        }
    }, [isEmpty]);

    return (
        <div className={cx('wrapper')}>
            <p className={cx('label')}>{label}</p>
            {suggestUser.map((user, index) => (
                <SuggestAccountItem key={index} data={user} />
            ))}
            {loading && (
                <div className={cx('account-loading')}>
                    <div className={cx('avatar-loading')} />
                    <div className={cx('item-info-loading')}>
                        <p className={cx('nickname-loading')}></p>
                        <p className={cx('name-loading')}></p>
                    </div>
                </div>
            )}
            {!isEmpty && !loading && (
                <p onClick={handleSeeMore} className={cx('more-btn')}>
                    See more
                </p>
            )}
            {isEmpty && !loading && <p className={cx('no-more-results')}>No more results</p>}
        </div>
    );
}

SuggestAccounts.propTypes = {
    label: PropTypes.string.isRequired,
};

export default memo(SuggestAccounts);
