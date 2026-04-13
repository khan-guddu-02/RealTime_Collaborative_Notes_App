import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import CreateNote from "../pages/CreateNote";
import SharedNote from "../pages/SharedNote";
import NoteEditor from "../pages/EditNote";
import PrivateRoute from "../components/PrivateRoute";
import ActivityLogs from "../pages/ActivityLogs";

export default function AppRoutes() {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* PUBLIC SHARE LINK */}
      <Route path="/share/:token" element={<SharedNote />} />

      {/* PROTECTED ROUTES */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/create"
        element={
          <PrivateRoute>
            <CreateNote />
          </PrivateRoute>
        }
      />

      <Route
        path="/note/:id"
        element={
          <PrivateRoute>
            <NoteEditor />
          </PrivateRoute>
        }
      />

      <Route
        path="/logs/:noteId"
        element={
          <PrivateRoute>
            <ActivityLogs />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
