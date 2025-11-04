import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./logIn-signIn/Auth";
import CreatePost from "./pages/CreatePost";
import SinglePost from "./pages/SinglePost";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home";
import PrivateRoute from "./logIn-signIn/PrivateRoute";
import Author from "./author/Author";
import Footer from "./pages/Description";
import ContactPage from "./contact/Contact";
import About from "./about/About";
import Category from "./category/Category";

function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        {/* Auth page at /auth for clarity; keep / redirect if needed */}
        <Route path="/" element={<AuthPage />} />
        <Route path="/auth" element={<AuthPage />} />

        {/* Protected route for create */}
        <Route
          path="/create"
          element={
            <PrivateRoute>
              <CreatePost />
            </PrivateRoute>
          } />
        <Route path="/dashboard" element={<Home />} />
        <Route path="/post/:id" element={<SinglePost />} />
        <Route path="/author" element={<Author />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/category" element={<Category/>} />
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;
