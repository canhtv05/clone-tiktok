import { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const ThemeContext = createContext();

function ThemeProvider({ children }) {
    const [isDark, setIsDark] = useState(false);

    const setDarkMode = () => {
        document.querySelector('body').setAttribute('data-theme', 'dark');
        localStorage.setItem('isDark', JSON.stringify(true));
        setIsDark(true);
    };

    const setLightMode = () => {
        document.querySelector('body').setAttribute('data-theme', 'light');
        localStorage.setItem('isDark', JSON.stringify(false));
        setIsDark(false);
    };

    useEffect(() => {
        const storeTheme = localStorage.getItem('isDark');
        if (storeTheme) {
            const isDarkMode = JSON.parse(storeTheme);
            setIsDark(isDarkMode);
            document.querySelector('body').setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
        }
    }, []);

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
