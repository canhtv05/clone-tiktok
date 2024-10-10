import { useState } from 'react';

function useLocalStorage(key, initValue) {
    const [storeValue, setStoreValue] = useState(() => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : initValue;
        } catch (error) {
            return initValue;
        }
    });

    const setValue = (value) => {
        try {
            const setStore = typeof value === 'function' ? setValue(value) : value;
            setStoreValue(setStore);
            localStorage.setItem(key, JSON.parse(setStore));
        } catch (error) {
            console.log('Error set store', error);
        }
    };
    return [storeValue, setValue];
}

export default useLocalStorage;
