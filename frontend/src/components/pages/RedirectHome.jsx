import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/Auth';

const RedirectHome = ({ children }) => {
    const { user, loadingPage } = useContext(AuthContext);
    if (loadingPage) return null;
    if (user) {
        return <Navigate to={'/'} />
    }
    return (
        <>
            {children}
        </>
    )
}

export default RedirectHome