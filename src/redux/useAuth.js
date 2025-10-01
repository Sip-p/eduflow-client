import { useSelector, useDispatch } from "react-redux";
import { loginUser, signUpUser, logout } from "./authSlice";

export const useAuth = () => {
    const dispatch = useDispatch();

    const { user, token, isLoading, isAuthenticated, error } = useSelector((state) => state.auth);

    const login = (credentials) => {
        return dispatch(loginUser(credentials));
    };
    const signup = (userData) => {
        return dispatch(signUpUser(userData));
    };
    const logoutUser = () => {
        dispatch(logout());
    };

    return {
        user,
        token,
        isLoading,
        error,
        isAuthenticated,
        login,
        signup,
        logout: logoutUser
    };
};