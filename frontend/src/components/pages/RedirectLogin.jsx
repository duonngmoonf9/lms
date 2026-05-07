import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/Auth';

const RedirectLogin = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    if (loading) return null;
    if (!user) {
        return <Navigate to={'/account/login'} />
    }
    return (
        <>
            {children}
        </>
    )
}

export default RedirectLogin