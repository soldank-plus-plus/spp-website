import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Custom hook that resets scroll position to top during AnimatePresence transitions
const ScrollToTop: React.FC = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        const timeout = setTimeout(() => {
            window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        }, 10);

        return () => clearTimeout(timeout);
    }, [pathname]);

    return null;
};

export default ScrollToTop;
