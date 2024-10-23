import { memo, useCallback, useEffect, useState, useMemo } from 'react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import styles from './SuggestAccounts.module.scss';
import SuggestAccountItem from './SuggestAccountItem';
import * as getSuggestedUser from '~/services/getSuggestedUser';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { setListSuggestedAccount } from '~/redux/slices/listSuggestedAccountSlice';

const cx = classNames.bind(styles);

function SuggestAccounts({ label }) {
    const dispatch = useDispatch();
    const [suggestUser, setSuggestUser] = useState([]);
    const [page, setPage] = useState(1);
    const [isEmpty, setIsEmpty] = useState(false);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');
    const listSuggestedAccount = useSelector((state) => state.listSuggestedAccount.listSuggestedAccount, shallowEqual);

    const fetchApi = useCallback(async () => {
        try {
            setLoading(true);
            let res;
            if (listSuggestedAccount.length > 0 && page === 1) {
                setSuggestUser(listSuggestedAccount);
                res = listSuggestedAccount;
            } else {
                res = await getSuggestedUser.getUserSuggested(5, page, token);
                dispatch(setListSuggestedAccount([...listSuggestedAccount, ...res]));
            }

            if (res && res.length > 0) {
                if (page > 1) {
                    setSuggestUser((prev) => [...prev, ...res]);
                } else {
                    setSuggestUser(res);
                }
                setIsEmpty(false);
            } else {
                setIsEmpty(true);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, token, dispatch]);

    useEffect(() => {
        fetchApi();
    }, [fetchApi]);

    const handleSeeMore = useCallback(() => {
        if (!isEmpty && !loading) {
            setPage((prev) => prev + 1);
        }
    }, [isEmpty, loading]);

    const memoizedSuggestUser = useMemo(() => suggestUser, [suggestUser]);

    return (
        <div className={cx('wrapper')}>
            <p className={cx('label')}>{label}</p>
            {memoizedSuggestUser.map((user, index) => (
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
