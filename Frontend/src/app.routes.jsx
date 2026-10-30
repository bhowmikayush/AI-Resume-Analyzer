 
import { createBrowserRouter } from "react-router-dom";

import Home from "./features/interview/pages/Home";
import Register from "./features/auth/pages/Register";
import Login from "./features/auth/pages/Login";
import Protected from "./features/auth/components/Protected";
import Answer from "./features/interview/pages/Answer";
import AdminUsers from "./features/interview/pages/AdminUsers";

export const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <Protected>
                <Home />
            </Protected>
        ),
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/register",
        element: <Register />,
    },
    {
        path: "/interview/:interviewId",
        element: (
            <Protected>
                <Answer />
            </Protected>
        ),
    },
    {
        path: "/admin",
        element: (
            <Protected requireAdmin>
                <AdminUsers />
            </Protected>
        ),
    },
    {
        path: "/admin/users",
        element: (
            <Protected requireAdmin>
                <AdminUsers />
            </Protected>
        ),
    },
]);
 