// usePostForm.js
import { useState } from "react";

const usePostForm = (initialState = { title: "", content: "", author: "" }) => {
  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData(initialState);
  };

  return { formData, handleChange, resetForm };
};

export default usePostForm;
