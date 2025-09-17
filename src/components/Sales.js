import React, { useEffect, useState } from "react";

function Sales() {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [quantityInputs, setQuantityInputs] = useState({});

  // Use your Render backend URL
  const API_BASE = "https://wings-cafe-1-bufx.onrender.com";

  useEffect(() => {
    fetch(`${API_BASE}/products`)
      .then((res) => res.json())
      .then(setProducts)
      .catch(console.error);

    fetch(`${API_BASE}/sales`)
      .then((res) => res.json())
      .then(setSales)
      .catch(() => setSales([]));
  }, []);

  const handleQuantityChange = (productId, value) => {
    setQuantityInputs((prev) => ({ ...prev, [productId]: value }));
  };

  const handleRecordSale = async (product) => {
    const qty = Number(quantityInputs[product.id]);
    if (!qty || qty <= 0) return alert("Enter a valid quantity");
    if (product.quantity < qty) return alert("Not enough stock");

    const saleEntry = {
      productId: product.id,
      productName: product.name,
      quantity: qty,
      price: product.price,
      total: Number(product.price) * qty,
      date: new Date().toISOString(),
    };

    // Record the sale
    const saleRes = await fetch(`${API_BASE}/sales`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(saleEntry),
    });
    const savedSale = await saleRes.json();

    // Update product stock
    const updatedProduct = { ...product, quantity: product.quantity - qty };
    await fetch(`${API_BASE}/products/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedProduct),
    });

    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? updatedProduct : p))
    );
    setSales((prev) => [...prev, savedSale]);
    setQuantityInputs((prev) => ({ ...prev, [product.id]: "" }));
  };

  return (
    <div className="sales-container">
      <h2 className="page-title">Sales</h2>

      {/* Product Cards */}
      <div className="product-cards">
        {products.length === 0 && <p>No products available.</p>}

        {products.map((p) => {
          const isLowStock = p.quantity <= 5;
          return (
            <div
              key={p.id}
              className={`product-card ${isLowStock ? "low-stock" : ""}`}
            >
              <img
                src={p.imageUrl || "https://via.placeholder.com/150?text=No+Image"}
                alt={p.name}
                className="product-img"
              />
              <h3 className="product-name">{p.name}</h3>
              <p className="product-price">Price: M{p.price}</p>
              <p className="product-qty">Available: {p.quantity}</p>

              <input
                type="number"
                min="1"
                max={p.quantity}
                value={quantityInputs[p.id] || ""}
                onChange={(e) => handleQuantityChange(p.id, e.target.value)}
                placeholder="Qty"
                className="qty-input"
              />

              <button
                className="btn btn-primary sell-btn"
                onClick={() => handleRecordSale(p)}
                disabled={p.quantity === 0}
              >
                Sell
              </button>
            </div>
          );
        })}
      </div>

      {/* Sales Records */}
      <div className="sales-records">
        <h3>Sales Records</h3>
        <table className="product-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Product</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((s) => (
              <tr key={s.id || `${s.productId}-${s.date}`}>
                <td>{new Date(s.date).toLocaleString()}</td>
                <td>{s.productName}</td>
                <td>{s.quantity}</td>
                <td>M{s.price}</td>
                <td>M{s.total}</td>
              </tr>
            ))}
            {sales.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No sales recorded.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Sales;
