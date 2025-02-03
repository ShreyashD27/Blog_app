import { useEffect, useState } from "react";
import axios from "axios";

const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [editingPost, setEditingPost] = useState(null);
    const [updatedTitle, setUpdatedTitle] = useState("");
    const [updatedDescription, setUpdatedDescription] = useState("");
    
    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 3; // Set how many posts to show per page

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/posts");
            setPosts(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            try {
                await axios.delete(`http://localhost:5000/api/posts/${id}`);
                fetchPosts();
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleEdit = (post) => {
        setEditingPost(post._id);
        setUpdatedTitle(post.title);
        setUpdatedDescription(post.description);
    };

    const handleUpdate = async (id) => {
        try {
            await axios.put(`http://localhost:5000/api/posts/${id}`, {
                title: updatedTitle,
                description: updatedDescription,
            });
            setEditingPost(null);
            fetchPosts();
        } catch (error) {
            console.error(error);
        }
    };

    // Filter posts based on search query
    const filteredPosts = posts.filter((post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination Logic
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

    return (
        <div className="container">
            <h2>All Posts</h2>

            {/* Search Input */}
            <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-bar"
            />

            {/* Display Posts */}
            {currentPosts.map((post) => (
                <div className="post-card" key={post._id}>
                    {editingPost === post._id ? (
                        <>
                            <input 
                                type="text" 
                                value={updatedTitle} 
                                onChange={(e) => setUpdatedTitle(e.target.value)} 
                            />
                            <textarea 
                                value={updatedDescription} 
                                onChange={(e) => setUpdatedDescription(e.target.value)} 
                            />
                            <button onClick={() => handleUpdate(post._id)}>Update</button>
                            <button onClick={() => setEditingPost(null)}>Cancel</button>
                        </>
                    ) : (
                        <>
                            <h3>{post.title}</h3>
                            {post.image && <img src={`http://localhost:5000${post.image}`} alt={post.title} />}
                            <p>{post.description}</p>
                            <div className="buttons">
                                <button className="edit-btn" onClick={() => handleEdit(post)}>Edit</button>
                                <button className="delete-btn" onClick={() => handleDelete(post._id)}>Delete</button>
                            </div>
                        </>
                    )}
                </div>
            ))}

            {/* Pagination Controls */}
            <div className="pagination">
                <button 
                    onClick={() => setCurrentPage(currentPage - 1)} 
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span> Page {currentPage} </span>
                <button 
                    onClick={() => setCurrentPage(currentPage + 1)} 
                    disabled={indexOfLastPost >= filteredPosts.length}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default PostList;
