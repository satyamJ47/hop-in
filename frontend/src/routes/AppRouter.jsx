import { createBrowserRouter, RouterProvider } from "react-router-dom";

import MainLayout from "@/layouts/MainLayout";

import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import NotFoundPage from "@/pages/NotFoundPage";
import SearchPage from "@/pages/SearchPage";
import BookingPage from "@/pages/BookingPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,

    children: [
        {
            index: true,
            element: <HomePage />,
        },
        {
            path: "login",
            element: <LoginPage />,
        },
        {
            path: "signup",
            element: <SignupPage />,
        },
        {
            path: "search",
            element: <SearchPage />,
        },
        {
            path: "rides/:rideId/book",
            element: <BookingPage />,
        },
        {
            path: "*",
            element: <NotFoundPage />,
        },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}