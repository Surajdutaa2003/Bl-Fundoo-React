import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Login from "../components/Login/login";
import RegisterPage from "../components/Register/Registerpage";
import Notes from "../components/NotesContainer/Notes";
import Archive from "../components/Archives/Archive";
import TrashNotes from "../components/TrashNotes/TrashNotes";
import ProtectedRoute from "../components/ProtectedRoutes"; // Protected Routes Handle Here

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute />, // ProtectedRoute now handles login & dashboard redirects
    children: [
      { path: "", element: <Login /> }, // Login Page
      { path: "register", element: <RegisterPage /> }, // Register Page
      {
        path: "dashboard",
        element: <Outlet />, // Ensures nested routing works correctly
        children: [
          { path: "", element: <Notes /> },
          { path: "archive", element: <Archive /> },
          { path: "trash", element: <TrashNotes /> },
        ],
      },
    ],
  },
  { path: "*", element: <h1>404 Page Not Found</h1> },
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}