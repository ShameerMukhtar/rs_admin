import React, { useState, useEffect } from "react";
import "./Blogs.css"; // Import CSS for styling
import { FaPlus } from "react-icons/fa"; // Icon for "Add Blog"

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" }); // Success/Error Modal State
  const [newBlog, setNewBlog] = useState({
    title: "",
    content: "",
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/blogs/get-all-blogs`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setBlogs(data.blogs);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewBlog({ ...newBlog, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const apiUrl = editingBlog
      ? `${import.meta.env.VITE_API_URL}/blogs/update-blog/${editingBlog._id}`
      : `${import.meta.env.VITE_API_URL}/blogs/create-blog`;

    const method = editingBlog ? "PUT" : "POST";

    try {
      const response = await fetch(apiUrl, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newBlog),
      });

      if (response.ok) {
        fetchBlogs();
        setShowForm(false);
        setEditingBlog(null);
        setNewBlog({ title: "", content: "" });
        setMessage({
          text: `Blog ${editingBlog ? "updated" : "added"} successfully!`,
          type: "success",
        });
      } else {
        throw new Error("Failed to save blog");
      }
    } catch (error) {
      setMessage({ text: "Something went wrong!", type: "error" });
    }
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setNewBlog({ title: blog.title, content: blog.content });
    setShowForm(true);
  };

  const handleDelete = async (blogId) => {
    const token = localStorage.getItem("token");
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/blogs/delete-blog/${blogId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        fetchBlogs();
        setMessage({ text: "Blog deleted successfully!", type: "success" });
      } else {
        throw new Error("Failed to delete blog");
      }
    } catch (error) {
      setMessage({ text: "Something went wrong!", type: "error" });
    }
  };

  return (
    <div className="blogs-container">
      <h1>Blogs</h1>

      {/* Add Blog Button (Icon) */}
      <button className="add-blog-btn" onClick={() => setShowForm(true)}>
        <FaPlus />
      </button>

      {message.text && (
        <div className={`modal ${message.type}`}>
          <p>{message.text}</p>
          <button onClick={() => setMessage({ text: "", type: "" })}>
            Close
          </button>
        </div>
      )}

      {showForm ? (
        <div className="blog-form">
          <h2>{editingBlog ? "Edit Blog" : "Add New Blog"}</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="title"
              placeholder="Blog Title"
              value={newBlog.title}
              onChange={handleChange}
              required
            />
            <textarea
              name="content"
              placeholder="Blog Content"
              value={newBlog.content}
              onChange={handleChange}
              required
            ></textarea>

            <button type="submit">{editingBlog ? "Update" : "Add"} Blog</button>
            <button type="button" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </form>
        </div>
      ) : (
        <div className="blog-list">
          {blogs.map((blog) => (
            <div key={blog._id} className="blog-item">
              <h3>{blog.title}</h3>
              <p>{blog.content}</p>
              <div className="blog-actions">
                <button className="update-btn" onClick={() => handleEdit(blog)}>
                  Update
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(blog._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Blogs;
