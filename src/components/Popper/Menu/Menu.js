import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import Tippy from '@tippyjs/react/headless';
import { useState, useContext } from 'react';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import { ThemeContext } from '~/components/Context/ThemeProvider';
import styles from './Menu.module.scss';
import MenuItem from './MenuItem';
import Header from './Header';

const cx = classNames.bind(styles);

const defaultFn = () => {};

function Menu({ children, items = [], hideOnClick = false, onChange = defaultFn }) {
    const [history, setHistory] = useState([{ data: items }]);
    const current = history[history.length - 1];
    const { setDarkMode, setLightMode } = useContext(ThemeContext);

    const renderItems = () => {
        return current.data.map((item, index) => {
            const isParent = !!item.children;

            return (
                <MenuItem
                    key={index}
                    data={item}
                    darkMode
                    onClick={() => {
                        onChange(item, index);
                        if (isParent) {
                            setHistory((prev) => [...prev, item.children]);
                        } else {
                            if (item.type === 'light') {
                                setLightMode();
                            } else if (item.type === 'dark') {
                                setDarkMode();
                            }
                        }
                    }}
                />
            );
        });
    };

    const handleBack = () => {
        setHistory((prev) => prev.slice(0, prev.length - 1));
    };

    const renderResult = (attrs) => (
        <div className={cx('menu-list')} tabIndex="-1" {...attrs}>
            <PopperWrapper className={cx('menu-popper')} arrow>
                {history.length > 1 && <Header title={current.title} onBack={handleBack} />}
                <div className={cx('menu-body')}>{renderItems()}</div>
            </PopperWrapper>
        </div>
    );

    const handleResetMenu = () => {
        return setHistory((prev) => prev.slice(0, 1));
    };

    return (
        <Tippy
            delay={[0, 700]}
            interactive
            offset={[12, 8]}
            placement="bottom-end"
            hideOnClick={hideOnClick}
            render={renderResult}
            onHide={handleResetMenu}
        >
            {children}
        </Tippy>
    );
}

Menu.propTypes = {
    children: PropTypes.node.isRequired,
    items: PropTypes.array,
    hideOnClick: PropTypes.bool,
    onChange: PropTypes.func,
};

export default Menu;
