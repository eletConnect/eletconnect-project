import { createBrowserRouter } from "react-router-dom";

// -- Páginas WEB --------------------
import LandingPage from "./_pages/web/landingPage/landingPage";
import PageNotFound from "./_pages/web/404";

import Home from "./_pages/web/home/home";

import Institution from "./_pages/web/institution/cadastro";

import Students from "./_pages/web/students/students";

import Courses from "./_pages/web/courses/courses";

import Settings from "./_pages/web/settings/settings";

import Login from "./_pages/web/auth/Login";
import Register from "./_pages/web/auth/Register";
import ConfirmRegistration from "./_pages/web/auth/confirmRegistration";
import ForgotPassword from "./_pages/web/auth/forgotPassword";
import ResetPassword from "./_pages/web/auth/resetPassword";
import Verification from "./_pages/web/auth/verification";

// -- Páginas MOBILE -------------------- 
import StudentLogin from "./_pages/mobile/auth/login";
import StudentForgotPassword from "./_pages/mobile/auth/forgotPassword";

const routers = createBrowserRouter([
    // Páginas WEB
    { path: '/', element: <LandingPage /> },
    { path: '*', element: <PageNotFound /> },

    { path: '/home', element: <Home /> },

    { path: '/instituicao', element: <Institution /> },

    { path: '/students', element: <Students /> },

    { path: '/courses', element: <Courses /> },

    { path: '/settings', element: <Settings /> },

    { path: '/login', element: <Login /> },
    { path: '/register', element: <Register /> },
    { path: '/confirm-registration', element: <ConfirmRegistration /> },
    { path: '/forgot-password', element: <ForgotPassword /> },
    { path: '/reset-password', element: <ResetPassword /> },
    { path: '/verification', element: <Verification /> },

    // Páginas MOBILE
    { path: '/mobile/login', element: <StudentLogin /> },
    { path: '/mobile/forgot-password', element: <StudentForgotPassword /> },
]);

export default routers;