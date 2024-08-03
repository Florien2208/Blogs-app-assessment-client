import { X } from "lucide-react";
import usePostForm from "./usePostForm";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

const AddPostModal = ({ isOpen, onClose, onAddPost }) => {
  const { formData, handleChange } = usePostForm();
  const [username, setUsername] = useState("");

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title && formData.content && username) {
      onAddPost({ ...formData, author: username });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-2xl w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Add New Post</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
            aria-label="Close modal"
          >
            <X size={28} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>
          <div>
            <label
              htmlFor="content"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Content
            </label>
            <textarea
              id="content"
              name="content"
              rows="4"
              value={formData.content}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
              required
            ></textarea>
          </div>
          <div>
            <label
              htmlFor="author"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Author
            </label>
            <input
              type="text"
              id="author"
              name="author"
              value={username}
              onChange={handleChange}
              readOnly
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
            >
              Add Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

AddPostModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAddPost: PropTypes.func.isRequired,
};

export default AddPostModal;