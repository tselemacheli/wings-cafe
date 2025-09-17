import React, { useState, useEffect } from "react";

function Products() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    quantity: "",
  });
  const [editingId, setEditingId] = useState(null);

  // ✅ Base URL for Render backend
  const API_BASE = "https://wings-cafe-1-bufx.onrender.com";

  useEffect(() => {
    fetch(`${API_BASE}/products`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.price || !formData.quantity) {
      alert("Please fill all required fields.");
      return;
    }

    const productData = { ...formData };

    try {
      if (editingId) {
        const res = await fetch(`${API_BASE}/products/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingId, ...productData }),
        });
        const updated = await res.json();
        setProducts((prev) => prev.map((p) => (p.id === editingId ? updated : p)));
        setEditingId(null);
      } else {
        const res = await fetch(`${API_BASE}/products`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        });
        const newProduct = await res.json();
        setProducts((prev) => [...prev, newProduct]);
      }

      setFormData({ name: "", category: "", description: "", price: "", quantity: "" });
    } catch (err) {
      console.error("Error saving product:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_BASE}/products/${id}`, { method: "DELETE" });
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      category: product.category,
      description: product.description || "",
      price: product.price,
      quantity: product.quantity,
    });
    setEditingId(product.id);
  };

  return (
    <div className="products-container">
      <h2>Product Management</h2>

      <form onSubmit={handleSubmit} style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <input type="text" name="name" placeholder="Product Name" value={formData.name} onChange={handleChange} required />
        <select name="category" value={formData.category} onChange={handleChange} required>
          <option value="">Category</option>
          <option value="Food">Food</option>
          <option value="Beverages">Beverages</option>
          <option value="Desserts">Desserts</option>
        </select>
        <input type="text" name="description" placeholder="Description" value={formData.description} onChange={handleChange} />
        <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} required />
        <input type="number" name="quantity" placeholder="Qty" value={formData.quantity} onChange={handleChange} required />
        <button type="submit">{editingId ? "Update Product" : "Add Product"}</button>
      </form>

      <table>
        <thead>
          <tr><th>Name</th><th>Category</th><th>Description</th><th>Price</th><th>Qty</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.category}</td>
              <td>{p.description}</td>
              <td>{p.price}</td>
              <td>{p.quantity}</td>
              <td>
                <button onClick={() => handleEdit(p)}>Edit</button>
                <button onClick={() => handleDelete(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
          {products.length === 0 && <tr><td colSpan="6">No products available</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

export default Products;
