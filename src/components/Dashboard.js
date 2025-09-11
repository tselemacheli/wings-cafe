import React, { useEffect, useState } from "react";

function Dashboard() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleImageUpload = async (e, productId) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const base64Image = await toBase64(file);
      const updatedProduct = products.find((p) => p.id === productId);
      updatedProduct.imageUrl = base64Image;

      await fetch(`/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProduct),
      });

      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? updatedProduct : p))
      );
    } catch (err) {
      console.error("Error uploading image:", err);
    }
  };

  const categories = [
    { title: "Food", filter: "food" },
    { title: "Desserts", filter: "desserts" },
    { title: "Beverages", filter: "beverages" },
  ];

  const renderItems = (cat) => {
    const items = products.filter(
      (p) => p.category?.toLowerCase() === cat.toLowerCase()
    );

    return items.length ? (
      <div className="category-items">
        {items.map((p) => {
          let statusText = "Sold Out";
          let statusColor = "red";

          if (p.quantity > 5) {
            statusText = "Available";
            statusColor = "green";
          } else if (p.quantity > 0 && p.quantity <= 5) {
            statusText = "Low Stock";
            statusColor = "orange";
          }

          return (
            <div className="product-mini-card" key={p.id}>
              <label style={{ cursor: "pointer" }}>
                <img
                  src={p.imageUrl || "https://via.placeholder.com/80?text=No+Image"}
                  alt={p.name || "No image"}
                  className="mini-img"
                  style={{ opacity: p.quantity > 0 ? 1 : 0.5 }}
                />
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => handleImageUpload(e, p.id)}
                />
              </label>
              <div className="mini-info">
                <p className="mini-name">{p.name}</p>
                <p className="mini-desc">{p.description}</p>
                <p className="mini-price">M{p.price}</p>
                <p className="mini-status" style={{ color: statusColor, fontWeight: "bold" }}>
                  {statusText}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    ) : (
      <p className="no-items">No products available.</p>
    );
  };

  return (
    <div className="dashboard-container">
      <h2 className="page-title">Dashboard</h2>
      <p className="welcome-message">Welcome to Wings Cafe</p>

      <div className="category-cards">
        {categories.map((c) => (
          <div className="category-card" key={c.title}>
            <h3>{c.title}</h3>
            {renderItems(c.filter)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
