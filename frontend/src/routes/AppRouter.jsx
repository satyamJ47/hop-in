import { createBrowserRouter, RouterProvider } from "react-router-dom";

import MainLayout from "@/layouts/MainLayout";

import ProtectedRoute from "./ProtectedRoute";

import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import NotFoundPage from "@/pages/NotFoundPage";
import SearchPage from "@/pages/SearchPage";
import BookingPage from "@/pages/BookingPage";
import MyBookingsPage from "@/pages/MyBookingsPage";
import BookingDetailsPage from "@/pages/BookingDetailsPage";
import ProfilePage from "@/pages/ProfilePage";
import RideDetailsPage from "@/pages/RideDetailsPage";
import BecomeDriverPage from "@/pages/BecomeDriverPage";
import DriverProfilePage from "@/pages/DriverProfilePage";
import CreateRidePage from "@/pages/CreateRidePage";

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
            path: "rides/:rideId",
            element: <RideDetailsPage />,
        },
        {
            path: "rides/:rideId/book",
            element: <BookingPage />,
        },
        {
            path: "*",
            element: <NotFoundPage />,
        },
        {
            path: "my-bookings",
            element:(
                <ProtectedRoute>
                    <MyBookingsPage/>
                </ProtectedRoute>
            )
        },
        {
            path: "bookings/:bookingId",
            element:(
                <ProtectedRoute>
                    <BookingDetailsPage/>
                </ProtectedRoute>
            )
        },
        {
            path: "profile",
            element:(
                <ProtectedRoute>
                    <ProfilePage/>
                </ProtectedRoute>
            )
        },
        {
            path: "become-driver",
            element:(
                <ProtectedRoute>
                    <BecomeDriverPage/>
                </ProtectedRoute>
            )
        },
        {
            path: "driver-profile",
            element:(
                <ProtectedRoute>
                    <DriverProfilePage/>
                </ProtectedRoute>
            )
        },
        {
            path: "create-ride",
            element:(
                <ProtectedRoute>
                    <CreateRidePage/>
                </ProtectedRoute>
            )
        },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}

// /my-bookings
//       ↓
// ProtectedRoute
//       ↓
// MyBookingsPage