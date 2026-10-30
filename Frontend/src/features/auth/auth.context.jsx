 
import {
    createContext,
    useState,
    useEffect,
} from "react";

import axios from "axios";

export const AuthContext = createContext(null);

const API_URL = "http://localhost:3000/api/auth";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check whether the user is already logged in.
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(
                    `${API_URL}/get-me`,
                    {
                        withCredentials: true,
                    }
                );

                const userData =
                    response.data?.user ?? response.data;

                setUser(userData);
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    // Update the authenticated user.
    const updateUser = (userData) => {
        setUser(userData);
    };

    // Clear the authenticated user.
    const clearUser = () => {
        setUser(null);
    };

    // Context values shared across the application.
    const contextValue = {
        user,
        setUser,
        loading,
        setLoading,
        updateUser,
        clearUser,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
 