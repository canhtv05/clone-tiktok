import { useRef, useEffect } from 'react';

function usePrevValue(value) {
    const ref = useRef();

    useEffect(() => {
        ref.current = value;
    });

    return ref.current;
}

export default usePrevValue;
