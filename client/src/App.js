import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AddPost from "./AddPost";
import PostList from "./PostList";
import Navbar from "./Navbar";

function App() {
    return (
        <Router>
             <Navbar />
            <Routes>
                <Route path="/" element={<PostList />} />
                <Route path="/add" element={<AddPost />} />
            </Routes>
        </Router>
    );
}

export default App;
