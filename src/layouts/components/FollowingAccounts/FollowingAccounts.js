import { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import styles from './FollowingAccounts.module.scss';
import AccountItem from './AccountItem';
import * as getSuggestedUser from '~/services/getSuggestedUser';
import { useDebounce } from '~/hooks';

const cx = classNames.bind(styles);

function SuggestAccounts({ label }) {
    const [suggestUser, setSuggestUser] = useState([]);
    const [page, setPage] = useState(1);
    const [isEmpty, setIsEmpty] = useState(false);
    const [loading, setLoading] = useState(true);

    const debouncedPage = useDebounce(page, 500);

    const fetchApi = useCallback(async () => {
        setLoading(true);

        try {
            const res = await getSuggestedUser.getUserSuggested(5, debouncedPage);
            if (res && res.length > 0) {
                setSuggestUser((prev) => [...prev, ...res]);
                setIsEmpty(false);
            } else {
                setIsEmpty(true);
            }
        } catch (error) {
            throw new Error('Error Call API Suggested Account');
        } finally {
            setLoading(false);
        }
    }, [debouncedPage]);

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
                <AccountItem key={index} data={user} />
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

export default SuggestAccounts;
