import React, { useEffect, useState } from "react";

function StockManagement() {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantityChange, setQuantityChange] = useState("");

  // Render backend base URL
  const API_BASE = "https://wings-cafe-1-1swa.onrender.com";

  useEffect(() => {
    fetch(`${API_BASE}/products`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  const handleUpdateStock = async (e) => {
    e.preventDefault();

    const selectedProduct = products.find(
      (p) => String(p.id) === String(selectedProductId)
    );

    if (!selectedProduct) {
      alert("Select a product first.");
      return;
    }

    const change = Number(quantityChange);
    if (!change) {
      alert("Enter a valid quantity (positive or negative).");
      return;
    }

    const updatedProduct = {
      ...selectedProduct,
      quantity: Number(selectedProduct.quantity) + change,
    };

    await fetch(`${API_BASE}/products/${selectedProduct.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedProduct),
    });

    setProducts((prev) =>
      prev.map((p) => (p.id === selectedProduct.id ? updatedProduct : p))
    );

    setSelectedProductId("");
    setQuantityChange("");
  };

  return (
    <div className="stock-container">
      <h2>Stock Management</h2>

      {/* Inline Form */}
      <form
        onSubmit={handleUpdateStock}
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <select
          onChange={(e) => setSelectedProductId(e.target.value)}
          value={selectedProductId}
          style={{ width: "180px" }}
          required
        >
          <option value="">Select Product</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} (Qty: {p.quantity})
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Qty +/-"
          value={quantityChange}
          onChange={(e) => setQuantityChange(e.target.value)}
          style={{ width: "120px" }}
          required
        />

        <button
          type="submit"
          style={{
            width: "120px",
            padding: "6px 10px",
            fontSize: "14px",
          }}
          className="btn btn-success"
        >
          Update Stock
        </button>
      </form>

      {/* Stock Table */}
      <div className="table-container">
        <table className="product-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>M{p.price}</td>
                <td>{p.quantity}</td>
                <td className={`status ${p.quantity <= 5 ? "low" : "ok"}`}>
                  {p.quantity <= 5 ? "Low Stock" : "In Stock"}
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No products available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StockManagement;
