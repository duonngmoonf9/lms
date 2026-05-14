import { createContext, useEffect, useState } from "react";
import { getAccountAPI } from "../services/api.service";

export const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loadingPage, setLoadingPage] = useState(true);

    useEffect(() => {
        const fetchUserInfo = async () => {
            // 1. Kiểm tra localStorage, nếu chưa từng đăng nhập thì không cần gọi API
            const storedUser = localStorage.getItem('userInfo');
            if (!storedUser) {
                setLoadingPage(false);
                return;
            }

            // 2. Nếu có token, gọi API lấy thông tin mới nhất
            try {
                const res = await getAccountAPI();
                // Chỉ set user nếu API trả về đúng object user (kiểm tra có res.id)
                if (res && res.id) {
                    setUser(res);
                } else {
                    // Token hết hạn hoặc không hợp lệ -> xóa đi
                    setUser(null);
                    localStorage.removeItem('userInfo');
                }
            } catch (error) {
                setUser(null);
            } finally {
                setLoadingPage(false); // Kết thúc quá trình loading
            }
        };

        fetchUserInfo();
    }, []);

    const logOut = () => {
        setUser(null);
        localStorage.removeItem('userInfo');
    }

    return (
        <AuthContext.Provider value={{ user, setUser, loadingPage, setLoadingPage, logOut }}>
            {children}
        </AuthContext.Provider>
    )
}