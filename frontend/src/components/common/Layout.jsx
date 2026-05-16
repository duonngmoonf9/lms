import { useContext } from "react";
import { AuthContext } from "../context/Auth";
import Footer from "./Footer";
import Header from "./Header";

const Layout = ({ children }) => {
    const { loadingPage } = useContext(AuthContext);
    return (
        <>

            {
                loadingPage == true ?
                    <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading course data...</span>
                        </div>
                    </div>
                    :
                    <>
                        <Header />
                        {children}
                        <Footer />
                    </>
            }
        </>
    )
}

export default Layout