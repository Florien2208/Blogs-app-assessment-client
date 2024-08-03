import { useState } from "react";
import { Edit, Trash, MessageSquare, Plus, Clock, User, X } from "lucide-react";
import AddPostModal from "./modal/AddPostModal";

const initialPosts = [
  {
    id: 1,
    title: "First Blog Post",
    content:
      "This is the content of the first blog post. It covers various topics and provides valuable insights.",
    author: "John Doe",
    createdAt: "2023-08-01T10:00:00Z",
    updatedAt: "2023-08-02T15:30:00Z",
    comments: ["Great post!", "Very informative."],
  },
  {
    id: 2,
    title: "Second Blog Post",
    content:
      "This is the content of the second blog post. It discusses recent developments in technology.",
    author: "Jane Smith",
    createdAt: "2023-08-03T09:15:00Z",
    updatedAt: "2023-08-03T14:45:00Z",
    comments: ["Interesting read."],
  },
  // Add more posts here to test the grid layout
];

const BlogPostManagement = () => {
  const [posts, setPosts] = useState(initialPosts);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isAddingPost, setIsAddingPost] = useState(false);

  const handlePostSelect = (post) => {
    setSelectedPost(post);
  };

  const handleOpenAddPostModal = () => {
    setIsAddingPost(true);
  };

  const handleCloseAddPostModal = () => {
    setIsAddingPost(false);
  };

  const handleCloseSelectedPost = () => {
    setSelectedPost(null);
  };

  const handleAddComment = () => {
    if (isAuthenticated && newComment.trim() !== "") {
      const updatedPosts = posts.map((post) =>
        post.id === selectedPost.id
          ? { ...post, comments: [...post.comments, newComment] }
          : post
      );
      setPosts(updatedPosts);
      setSelectedPost({
        ...selectedPost,
        comments: [...selectedPost.comments, newComment],
      });
      setNewComment("");
    }
  };

  const handleAddNewPost = (newPost) => {
    const updatedPosts = [
      ...posts,
      {
        ...newPost,
        id: posts.length + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        comments: [],
      },
    ];
    setPosts(updatedPosts);
    setIsAddingPost(false);
  };

  const toggleAuth = () => {
    setIsAuthenticated(!isAuthenticated);
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Blog Post Management</h1>

      <button
        onClick={toggleAuth}
        className={`mb-4 px-4 py-2 rounded ${
          isAuthenticated ? "bg-red-500" : "bg-green-500"
        } text-white`}
      >
        {isAuthenticated ? "Log Out" : "Log In"}
      </button>

      {isAuthenticated && (
        <button
          onClick={handleOpenAddPostModal}
          className="mb-4 ml-2 px-4 py-2 rounded bg-blue-500 text-white flex items-center"
        >
          <Plus size={18} className="mr-2" /> Add New Post
        </button>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white p-4 rounded shadow cursor-pointer hover:bg-gray-100"
            onClick={() => handlePostSelect(post)}
          >
            <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
            <p className="text-gray-600 mb-2">
              {post.content.substring(0, 100)}...
            </p>
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <User size={14} className="mr-1" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <Clock size={14} className="mr-1" />
              <span>Created: {formatDate(post.createdAt)}</span>
            </div>
            {isAuthenticated && (
              <div className="mt-2">
                <button className="text-blue-500 mr-2">
                  <Edit size={18} />
                </button>
                <button className="text-red-500">
                  <Trash size={18} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">{selectedPost.title}</h2>
              <button
                onClick={handleCloseSelectedPost}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <p className="mb-4">{selectedPost.content}</p>
            <div className="text-sm text-gray-500 mb-2">
              <User size={14} className="inline mr-1" />
              <span>{selectedPost.author}</span>
            </div>
            <div className="text-sm text-gray-500 mb-2">
              <Clock size={14} className="inline mr-1" />
              <span>Created: {formatDate(selectedPost.createdAt)}</span>
            </div>
            <div className="text-sm text-gray-500 mb-4">
              <Clock size={14} className="inline mr-1" />
              <span>Updated: {formatDate(selectedPost.updatedAt)}</span>
            </div>
            <h3 className="font-semibold mb-2">Comments</h3>
            {selectedPost.comments.map((comment, index) => (
              <div key={index} className="bg-gray-100 p-2 rounded mb-2">
                {comment}
              </div>
            ))}
            {isAuthenticated && (
              <div className="mt-4">
                <textarea
                  className="w-full p-2 border rounded"
                  rows="3"
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                ></textarea>
                <button
                  onClick={handleAddComment}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded flex items-center"
                >
                  <MessageSquare size={18} className="mr-2" /> Add Comment
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      <AddPostModal
        isOpen={isAddingPost}
        onClose={handleCloseAddPostModal}
        onAddPost={handleAddNewPost}
      />
    </div>
  );
};

export default BlogPostManagement;
