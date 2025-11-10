import React, { useState, useEffect } from "react";
import "./TotalPost.css";
import AuthorLayout from "../AuthorLayout/AuthorLayout";

const POSTS_PER_PAGE = 6;

const TotalPost = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    // 🧠 Get logged-in user from localStorage
    const user = JSON.parse(localStorage.getItem("user")); // user info saved after login
    const isAdmin = user?.email === "kadmin@gmail.com"; // Only this email can delete
    const token = localStorage.getItem("token"); // must be the token containing email

    // Fetch posts
    const fetchPosts = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/posts");
            if (!res.ok) throw new Error("Failed to fetch posts");
            const data = await res.json();
            setPosts(data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching posts:", err);
            setMessage("Error fetching posts");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    // Delete post
    const handleDelete = async (id) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this post?");
        if (!isConfirmed) return;

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:5000/api/posts/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (res.ok) {
                setPosts(posts.filter((post) => post._id !== id));
                setMessage("Post deleted successfully");
            } else {
                setMessage(data.message || "Failed to delete post");
            }
        } catch (err) {
            console.error("Delete post error:", err);
            setMessage("Server error. Try again later.");
        }
    };

    // Filter posts
    const filteredPosts = posts.filter(
        (post) =>
            post.title?.toLowerCase().includes(search.toLowerCase()) ||
            post.content?.toLowerCase().includes(search.toLowerCase())
    );

    // Pagination
    const indexOfLastPost = currentPage * POSTS_PER_PAGE;
    const indexOfFirstPost = indexOfLastPost - POSTS_PER_PAGE;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);

    const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

    if (loading) return <p className="loading">Loading posts...</p>;

    return (
        <AuthorLayout>
            <div className="total-post-container">
                <div className="header">
                    <h2>Total Posts: {filteredPosts.length}</h2>
                    <input
                        type="text"
                        placeholder="Search posts..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="search-input"
                    />
                </div>

                {message && <p className="message">{message}</p>}

                <div className="posts-list">
                    {currentPosts.length === 0 ? (
                        <p>No posts found.</p>
                    ) : (
                        currentPosts.map((post) => (
                            <div className="post-card" key={post._id}>
                                <h3>{post.title || "Untitled"}</h3>
                                <p className="author-date">
                                    By {post.author?.name || "Admin"} |{" "}
                                    {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "Unknown date"}
                                </p>
                                <p>{post.content ? post.content.substring(0, 100) + "..." : "No content"}</p>

                                {/* 👇 Only show Delete if the logged user is the admin */}
                                {isAdmin && (
                                    <button className="delete-btn" onClick={() => handleDelete(post._id)}>
                                        Delete
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {totalPages > 1 && (
                    <div className="pagination">
                        <button onClick={prevPage} disabled={currentPage === 1}>
                            Prev
                        </button>
                        <span>
                            Page {currentPage} of {totalPages}
                        </span>
                        <button onClick={nextPage} disabled={currentPage === totalPages}>
                            Next
                        </button>
                    </div>
                )}
            </div>
        </AuthorLayout>
    );
};

export default TotalPost;
