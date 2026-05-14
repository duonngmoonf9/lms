import { useContext } from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/Auth';

const RedirectHome = ({ children }) => {
    const { user, loadingPage } = useContext(AuthContext);
    if (loadingPage) {
        return (
            <div
                className="loader"
                style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%,-50%)",
                    zIndex: 99999
                }}
            >
                <AiOutlineLoading3Quarters
                    className="loaderIcon"
                    style={{ fontSize: 48, color: "#1da599" }}
                />
            </div>
        );

    };
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