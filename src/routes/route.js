import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Login from "../components/Login/login";
import RegisterPage from "../components/Register/Registerpage";
import Notes from "../components/NotesContainer/Notes";
import Archive from "../components/Archives/Archive";
import TrashNotes from "../components/TrashNotes/TrashNotes";
import ProtectedRoute from "../components/ProtectedRoutes"; // Import ProtectedRoute

const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/register", element: <RegisterPage /> },
  {
    path: "/dashboard",
    element: <ProtectedRoute />, // Protect the entire dashboard
    children: [
      { path: "", element: <Notes /> },
      { path: "archive", element: <Archive /> },
      { path: "trash", element: <TrashNotes /> },
    ],
  },
  { path: "*", element: <h1>404 Page Not Found</h1> },
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}
