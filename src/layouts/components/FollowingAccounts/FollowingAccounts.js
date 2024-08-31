import { useEffect, useState, useCallback } from 'react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import styles from './FollowingAccounts.module.scss';
import AccountItem from './AccountItem';
import * as getSuggestedUser from '~/services/getSuggestedUser';

const cx = classNames.bind(styles);

function SuggestAccounts({ label }) {
    const [suggestUser, setSuggestUser] = useState([]);
    const [page, setPage] = useState(7);
    const [isEmpty, setIsEmpty] = useState(false);

    const fetchApi = useCallback(async () => {
        const res = await getSuggestedUser.getUserSuggested(5, page);
        if (res && res.length > 0) {
            setSuggestUser((prev) => [...prev, ...res]);
            setIsEmpty(false);
        } else {
            setIsEmpty(true);
        }
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
                <AccountItem key={index} data={user} />
            ))}
            <p onClick={handleSeeMore} className={cx('more-btn')}>
                See more
            </p>
        </div>
    );
}

SuggestAccounts.propTypes = {
    label: PropTypes.string.isRequired,
};

export default SuggestAccounts;
