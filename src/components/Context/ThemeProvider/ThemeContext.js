import { createContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import useLocalStorage from '~/hooks/useLocalStorage';

const ThemeContext = createContext();

function ThemeProvider({ children }) {
    const [isDark, setIsDark] = useLocalStorage('isDark', '');

    const setDarkMode = () => {
        document.querySelector('body').setAttribute('data-theme', 'dark');
        setIsDark(true);
    };

    const setLightMode = () => {
        document.querySelector('body').setAttribute('data-theme', 'light');
        setIsDark(false);
    };

    useEffect(() => {
        if (isDark) {
            setIsDark(isDark);
            document.querySelector('body').setAttribute('data-theme', isDark ? 'dark' : 'light');
        }
    }, [setIsDark, isDark]);

    const value = {
        isDark,
        setDarkMode,
        setLightMode,
    };

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

ThemeProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export { ThemeProvider, ThemeContext };
