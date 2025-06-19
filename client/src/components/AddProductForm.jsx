import { useState } from "react";
import axios from "axios";

const AddProductForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: "",
    price: "",
    sku: "", 
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Frontend validation for SKU
    if (!formData.sku.trim()) {
      return alert("SKU is required");
    }

    try {
      const token = localStorage.getItem("token"); // or from context
      await axios.post("http://localhost:5000/api/products", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Product added successfully");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to add product");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" onChange={handleChange} placeholder="Name" required />
      <input name="category" onChange={handleChange} placeholder="Category" required />
      <input name="quantity" onChange={handleChange} placeholder="Quantity" required />
      <input name="price" onChange={handleChange} placeholder="Price" required />
      <input name="sku" onChange={handleChange} placeholder="SKU" required />

      <button type="submit">Add Product</button>
    </form>
  );
};

export default AddProductForm;
