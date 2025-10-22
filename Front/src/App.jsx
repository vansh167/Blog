import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./logIn-signIn/Auth";
import CreatePost from "./pages/CreatePost";
import SinglePost from "./pages/SinglePost";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home";
// import PrivateRoute from "./logIn-signIn/PrivateRoute";

function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/dashboard" element={<Home />} />
        <Route path="/post/:id" element={<SinglePost />} />
      </Routes>
    </Router>
  );
}

export default App;
