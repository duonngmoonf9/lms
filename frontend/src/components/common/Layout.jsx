import { useContext } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { AuthContext } from "../context/Auth";
import Footer from "./Footer";
import Header from "./Header";

const Layout = ({ children }) => {
    const { loading } = useContext(AuthContext);

    return (
        <>

            {
                loading == true ?
                    <div className="loader" style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}>
                        <p>Loading Data</p>
                        <AiOutlineLoading3Quarters className="loaderIcon" style={{ fontSize: 48, }} />
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