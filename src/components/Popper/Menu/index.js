import classNames from 'classnames/bind';
import Tippy from '@tippyjs/react/headless';
import { useState, useCallback, useEffect } from 'react';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import styles from './Menu.module.scss';
import MenuItem from './MenuItem';
import Header from './Header';

const cx = classNames.bind(styles);

const defaultFn = () => {};

function Menu({ children, items = [], onChange = defaultFn }) {
    const [history, setHistory] = useState([{ data: items }]);
    const [mode, setMode] = useState('');

    const current = history[history.length - 1];

    const handleItemClick = useCallback(
        (item) => {
            const isParent = !!item.children;

            if (isParent) {
                setMode(item.children.title);
                setHistory((prevHistory) => [...prevHistory, item.children]);
            } else {
                onChange(item);
            }
        },
        [onChange],
    );

    useEffect(() => {});

    const renderItems = () => {
        return current.data.map((item, index) => {
            return <MenuItem key={index} data={item} onClick={() => handleItemClick(item)} />;
        });
    };

    return (
        <Tippy
            delay={[0, 700]}
            interactive
            offset={[12, 8]}
            placement="bottom-end"
            render={(attrs) => (
                <div className={cx('menu-list')} tabIndex="-1" {...attrs}>
                    <PopperWrapper className={cx('menu-popper')}>
                        {history.length > 1 && (
                            <Header
                                title={mode}
                                onBack={() => {
                                    setHistory((prev) => prev.slice(0, prev.length - 1));
                                }}
                            />
                        )}
                        {renderItems()}
                    </PopperWrapper>
                </div>
            )}
            onHide={() => setHistory((prev) => prev.slice(0, 1))}
        >
            {children}
        </Tippy>
    );
}

export default Menu;
