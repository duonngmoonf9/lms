import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/Auth';

const RedirectLogin = ({ children }) => {
    const { user, loadingPage } = useContext(AuthContext);
    if (loadingPage) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading course data...</span>
                </div>
            </div>
        );

    };
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