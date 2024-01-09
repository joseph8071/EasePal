import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Chat from "./pages/Chat";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { useEffect } from "react";

function App() {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is logged in
    if (auth?.isLoggedIn && auth.user) {
      // Redirect to the chat page
      navigate('/chat');
    }
  }, [auth, navigate]); // Dependency array includes auth and navigate

  return (
    <main>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {auth?.isLoggedIn && auth.user && (
          <Route path="/chat" element={<Chat />} />
        )}
        <Route path="*" element={<Home />} />
      </Routes>
    </main>
  );
}

export default App;
