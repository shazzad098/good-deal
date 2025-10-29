// client/src/components/routing/ScrollToTop.js
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
    const { pathname } = useLocation(); // Pathname change holei kaj korbe

    useEffect(() => {
        window.scrollTo(0, 0); // Window-ke scroll kore (0, 0) position-e niye jabe
    }, [pathname]); // Shudhu pathname change holei ei effect run korbe

    return null; // Ei component kichu render korbe na
}

export default ScrollToTop;