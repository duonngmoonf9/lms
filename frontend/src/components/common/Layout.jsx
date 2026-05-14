import { useContext } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { AuthContext } from "../context/Auth";
import Footer from "./Footer";
import Header from "./Header";

const Layout = ({ children }) => {
    const { loadingPage } = useContext(AuthContext);
    return (
        <>

            {
                loadingPage == true ?
                    <div
                        className="loader"
                        style={{
                            position: "fixed",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%,-50%)",
                            zIndex: 99999 // <-- Thêm cái này để nó đè lên mọi thứ
                        }}
                    >
                        <AiOutlineLoading3Quarters
                            className="loaderIcon"
                            style={{ fontSize: 48, color: "#1da599" }} // <-- Thêm màu đỏ để dễ nhìn
                        />
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