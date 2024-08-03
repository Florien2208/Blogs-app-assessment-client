import { useEffect, useState } from "react";
import {
  Edit,
  Trash,
  MessageSquare,
  Plus,
  Clock,
  User,
  X,
  Save,
} from "lucide-react";
import AddPostModal from "./modal/AddPostModal";
import Cookies from "js-cookie";
import axios from "axios";
import Notiflix from "notiflix";
import EditPostModal from "./modal/EditPostModal";

const BlogPostManagement = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
const [username, setUsername] = useState("");
  const [newComment, setNewComment] = useState("");
  const [isAddingPost, setIsAddingPost] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
     const [isEditingPost, setIsEditingPost] = useState(false);
     const [editingPost, setEditingPost] = useState(null);
      const [editingComment, setEditingComment] = useState(null);
   const token = Cookies.get("accessToken");


    useEffect(() => {
      fetchPosts();
    }, []);

    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("/api/posts"); 
         const postsWithCommentCounts = await Promise.all(
           response.data.map(async (post) => {
             const commentsResponse = await axios.get(
               `/api/comments/post/${post.id}`
             );
             return { ...post, commentCount: commentsResponse.data.length };
           })
         );
        setPosts(postsWithCommentCounts);
        console.log("response",response)
        setIsLoading(false);
      } catch (err) {
        setError("Failed to fetch posts");
        setIsLoading(false);
      }
    };
const handlePostSelect = async (post) => {
  try {
    const commentsResponse = await axios.get(`/api/comments/post/${post.id}`);
    setSelectedPost({ ...post, comments: commentsResponse.data });
  } catch (err) {
    console.error("Failed to fetch comments", err);
    setSelectedPost(post);
  }
};
const handleEditComment = (comment) => {
  setEditingComment({ ...comment, editContent: comment.content });
};
 const handleUpdateComment = async () => {
   if (token && editingComment.editContent.trim() !== "") {
     try {
       const response = await axios.put(`/api/comments/${editingComment.id}`, {
         content: editingComment.editContent,
       });

       const updatedComments = selectedPost.comments.map((comment) =>
         comment.id === editingComment.id ? response.data : comment
       );

       setSelectedPost({ ...selectedPost, comments: updatedComments });
       setEditingComment(null);
       Notiflix.Notify.success("Comment updated successfully!");
     } catch (err) {
       console.error("Failed to update comment", err);
       Notiflix.Notify.failure("Failed to update comment. Please try again.");
     }
   }
 };

 const handleDeleteComment = async (commentId) => {
   Notiflix.Confirm.show(
     "Confirm Deletion",
     "Are you sure you want to delete this comment?",
     "Yes, Delete",
     "Cancel",
     async () => {
       try {
         await axios.delete(`/api/comments/${commentId}`);
         const updatedComments = selectedPost.comments.filter(
           (comment) => comment.id !== commentId
         );
         const updatedPost = {
           ...selectedPost,
           comments: updatedComments,
           commentCount: selectedPost.commentCount - 1,
         };
         setSelectedPost(updatedPost);
         const updatedPosts = posts.map((post) =>
           post.id === updatedPost.id ? updatedPost : post
         );
         setPosts(updatedPosts);
         Notiflix.Notify.success("Comment deleted successfully!");
       } catch (err) {
         console.error("Failed to delete comment", err);
         Notiflix.Notify.failure("Failed to delete comment. Please try again.");
       }
     },
     () => {
       Notiflix.Notify.info("Deletion cancelled");
     }
   );
 };

  const handleOpenAddPostModal = () => {
    setIsAddingPost(true);
  };

  const handleCloseAddPostModal = () => {
    setIsAddingPost(false);
  };
  const handleCloseEditPostModal = () => {
    setIsEditingPost(false);
    setEditingPost(null);
  };
  const handleCloseSelectedPost = () => {
    setSelectedPost(null);
  };
  const handleEditPost = (post) => {
    setEditingPost(post);
    setIsEditingPost(true);
  };
   const handleAddComment = async () => {
     if (token && newComment.trim() !== "") {
       try {
         const response = await axios.post("/api/comments", {
           postId: selectedPost.id,
           content: newComment,
           author: username, 
         });

         const updatedPost = {
           ...selectedPost,
           comments: [...selectedPost.comments, response.data],
           commentCount: (selectedPost.commentCount || 0) + 1,
         };

         setSelectedPost(updatedPost);
         const updatedPosts = posts.map((post) =>
           post.id === updatedPost.id ? updatedPost : post
         );
         setPosts(updatedPosts);
         setNewComment("");
         Notiflix.Notify.success("Comment added successfully!");
       } catch (err) {
         console.error("Failed to add comment", err);
         Notiflix.Notify.failure("Failed to add comment. Please try again.");
       }
     }
   };
const handleDeletePost = (postId) => {
  Notiflix.Confirm.show(
    "Confirm Deletion",
    "Are you sure you want to delete this post?",
    "Yes, Delete",
    "Cancel",
    async () => {
      try {
        await axios.delete(`/api/posts/${postId}`);
        const updatedPosts = posts.filter((post) => post.id !== postId);
        setPosts(updatedPosts);
        if (selectedPost && selectedPost.id === postId) {
          setSelectedPost(null);
        }
        Notiflix.Notify.success("Post deleted successfully!");
      } catch (err) {
        console.error("Failed to delete post", err);
        Notiflix.Notify.failure("Failed to delete post. Please try again.");
      }
    },
    () => {
      Notiflix.Notify.info("Deletion cancelled");
    }
  );
};
  const handleAddNewPost = async (newPost) => {
  Notiflix.Confirm.show(
    'Confirm Action',
    'Are you sure you want to add this new post?',
    'Yes',
    'No',
    async () => {
      try {
        console.log("newPost", newPost);
        const response = await axios.post("/api/posts", newPost);
        
        if (response.status === 200 || response.status === 201) {
          setPosts([...posts, response.data]);
          setIsAddingPost(false);
          Notiflix.Notify.success('New post added successfully!');
        } else {
          throw new Error('Unexpected response status');
        }
      } catch (err) {
        console.error("Failed to add new post", err);
        Notiflix.Notify.failure('Failed to add new post. Please try again.');
      }
    },
    () => {
      Notiflix.Notify.info('Action cancelled');
    }
  );
};
  const handleUpdatePost = async (updatedPost) => {
    Notiflix.Confirm.show(
      "Confirm Action",
      "Are you sure you want to update this post?",
      "Yes",
      "No",
      async () => {
        try {
          const response = await axios.put(
            `/api/posts/${updatedPost.id}`,
            updatedPost
          );

          if (response.status === 200) {
            const updatedPosts = posts.map((post) =>
              post.id === updatedPost.id ? response.data : post
            );
            setPosts(updatedPosts);
            setIsEditingPost(false);
            setEditingPost(null);
            if (selectedPost && selectedPost.id === updatedPost.id) {
              setSelectedPost(response.data);
            }
            Notiflix.Notify.success("Post updated successfully!");
          } else {
            throw new Error("Unexpected response status");
          }
        } catch (err) {
          console.error("Failed to update post", err);
          Notiflix.Notify.failure("Failed to update post. Please try again.");
        }
      },
      () => {
        Notiflix.Notify.info("Update cancelled");
      }
    );
  };

  useEffect(() => {
    const user1 = Cookies.get("User");
    if (user1) {
      try {
        const userData = JSON.parse(user1);
        setUsername(userData.username);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);
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
if (isLoading) return <div>Loading...</div>;
if (error) return <div>Error: {error}</div>;
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Blog Post Management</h1>

      {token && (
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
              <span>Created: {formatDate(post.updated_at)}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <MessageSquare size={14} className="mr-1" />
              <span>Comments: {post.commentCount || 0}</span>
            </div>
            {token && (
              <div className="mt-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditPost(post);
                  }}
                  className="text-blue-500 mr-2"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeletePost(post.id);
                  }}
                  className="text-red-500"
                >
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
              <h2 className="text-2xl font-semibold">
                <b>Title:</b>
                {"   "}
                {selectedPost.title}
              </h2>
              <button
                onClick={handleCloseSelectedPost}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <p className="mb-4">
              <b>Content:</b>
              {"  "}
              {selectedPost.content}
            </p>
            <div className="text-sm text-gray-500 mb-2">
              <User size={14} className="inline mr-1" />
              <span>
                <b>Author: </b>
                {selectedPost.author}
              </span>
            </div>
            <div className="text-sm text-gray-500 mb-2">
              <Clock size={14} className="inline mr-1" />
              <span>Created: {formatDate(selectedPost.created_at)}</span>
            </div>
            <div className="text-sm text-gray-500 mb-4">
              <Clock size={14} className="inline mr-1" />
              <span>Updated: {formatDate(selectedPost.updated_at)}</span>
            </div>
            <h3 className="font-semibold mb-2">Comments</h3>
            {selectedPost.comments && selectedPost.comments.length > 0 ? (
              selectedPost.comments.map((comment) => (
                <div key={comment.id} className="bg-gray-100 p-2 rounded mb-2">
                  {editingComment && editingComment.id === comment.id ? (
                    <>
                      <textarea
                        className="w-full p-2 border rounded mb-2"
                        value={editingComment.editContent}
                        onChange={(e) =>
                          setEditingComment({
                            ...editingComment,
                            editContent: e.target.value,
                          })
                        }
                      />
                      <div className="flex justify-end">
                        <button
                          onClick={handleUpdateComment}
                          className="text-green-500 mr-2"
                        >
                          <Save size={18} />
                        </button>
                        <button
                          onClick={() => setEditingComment(null)}
                          className="text-gray-500"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p>{comment.content}</p>
                      <small className="text-gray-500">
                        By: {comment.author} | {formatDate(comment.created_at)}
                      </small>
                      {token && (
                        <div className="flex justify-end mt-2">
                          <button
                            onClick={() => handleEditComment(comment)}
                            className="text-blue-500 mr-2"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-red-500"
                          >
                            <Trash size={18} />
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))
            ) : (
              <p>No comments yet.</p>
            )}
            {token && (
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
      <EditPostModal
        isOpen={isEditingPost}
        onClose={handleCloseEditPostModal}
        onUpdatePost={handleUpdatePost}
        post={editingPost}
      />
    </div>
  );
};

export default BlogPostManagement;
