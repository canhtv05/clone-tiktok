import classNames from 'classnames/bind';
import { useState, useEffect, useRef } from 'react';
import AccountItem from '~/components/AccountItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import HeadlessTippy from '@tippyjs/react/headless';
import { faCircleXmark, faMagnifyingGlass, faSpinner } from '@fortawesome/free-solid-svg-icons';

import * as searchService from '~/services/searchService';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import styles from './Search.module.scss';
import { useDebounce } from '~/hooks';

const cx = classNames.bind(styles);

function Search() {
    const [searchValue, setSearchValue] = useState('');
    const [searchRes, setSearchRes] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);

    const debouncedValue = useDebounce(searchValue, 500);

    const inputRef = useRef();

    const handleClear = () => {
        setSearchValue('');
        setSearchRes([]);
        inputRef.current.focus();
    };

    useEffect(() => {
        if (!debouncedValue.trim()) {
            setSearchRes([]);
            return;
        }
        setLoading(true);

        const fetchApi = async () => {
            setLoading(true);
            const result = await searchService.search(debouncedValue);
            setSearchRes(result);
            setLoading(false);
        };

        fetchApi();
    }, [debouncedValue]);

    const handleHideResult = () => {
        setShowResult(false);
    };

    const handleChange = (e) => {
        const searchValue = e.target.value;
        if (!searchValue.startsWith(' ') || searchValue.trim()) {
            setSearchValue(searchValue);
        }
    };

    return (
        /*
            Using a wrapper <div> or <span> tag around the reference
            element solves this by creating a new parentNode context. 
        */
        <div>
            <HeadlessTippy
                interactive
                visible={showResult && searchRes.length > 0}
                render={(attrs) => (
                    <div className={cx('search-result')} tabIndex="-1" {...attrs}>
                        <PopperWrapper>
                            <h4 className={cx('search-title')}>Account</h4>
                            {searchRes.map((res) => (
                                <AccountItem key={res.id} data={res} onClick={handleHideResult} />
                            ))}
                        </PopperWrapper>
                    </div>
                )}
                onClickOutside={handleHideResult}
            >
                <div className={cx('search')}>
                    <input
                        ref={inputRef}
                        value={searchValue}
                        placeholder="Search accounts and videos"
                        spellCheck={false}
                        onChange={handleChange}
                        onFocus={() => setShowResult(true)}
                    />
                    {!!searchValue && !loading && (
                        <button className={cx('clear')} onClick={handleClear}>
                            <FontAwesomeIcon icon={faCircleXmark} />
                        </button>
                    )}

                    {loading && <FontAwesomeIcon className={cx('loading')} icon={faSpinner} />}
                    <button className={cx('search-btn')} onMouseDown={(e) => e.preventDefault()}>
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </button>
                </div>
            </HeadlessTippy>
        </div>
    );
}

export default Search;
