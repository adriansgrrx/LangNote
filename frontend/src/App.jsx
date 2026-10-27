import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import CreateNote from "./pages/CreateNote";
import NoteDetailsPage from "./pages/NoteDetailsPage";
import Login from "./pages/Login";
import CreateAccount from "./pages/CreateAccount";
import api from "./lib/axios";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setAuthLoading(false);
        return;
      }

      try {
        const res = await api.get("/users/me");
        setUser(res.data);
      } catch {
        localStorage.removeItem("token");
      } finally {
        setAuthLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="min-h-screen bg-base-200 text-base-content">
      <Routes>
        <Route path="/" element={<HomePage user={user} setUser={setUser} />} />
        <Route 
          path="/login" 
          element={!authLoading && user ? <Navigate to="/" replace /> : <Login setUser={setUser} />} 
        />
        <Route 
          path="/register" 
          element={!authLoading && user ? <Navigate to="/" replace /> : <CreateAccount setUser={setUser} />} 
        />
        <Route 
          path="/create" 
          element={
            <ProtectedRoute user={user} authLoading={authLoading}>
              <CreateNote />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/note/:id" 
          element={
            <ProtectedRoute user={user} authLoading={authLoading}>
              <NoteDetailsPage />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </div>
  );
};

export default App;
