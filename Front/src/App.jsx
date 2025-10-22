// App.js or wherever you define routes
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Home";
import AuthPage from "./logIn-signIn/Auth";
import CreatePost from "./pages/CreatePost";
import SinglePost from "./pages/SinglePost";
import Navbar from "./components/Navbar/Navbar";
function App() {
  return (
    <Router>
      
      <Routes>
        <Route path="/" element={<AuthPage/>} />
       </Routes>
        <Navbar/>
      <Routes>
        <Route path="/create" element={<CreatePost/>} />
        <Route path="/dashboard" element={<Dashboard />} />
         <Route path="/post/:id" element={<SinglePost />} />
      </Routes>
    </Router>
  );
}

export default App;
