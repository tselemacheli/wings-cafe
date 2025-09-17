import React, { useEffect, useState } from "react";

function Reports() {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Use your Render backend URL
  const API_BASE = "https://wings-cafe-1-1swa.onrender.com";

  useEffect(() => {
    fetch(`${API_BASE}/sales`)
      .then((res) => res.json())
      .then((salesData) => {
        setSales(salesData);
        return fetch(`${API_BASE}/products`);
      })
      .then((res) => res.json())
      .then((productsData) => {
        setProducts(productsData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  }, []);

  const getSalesPerProduct = () => {
    const productSales = {};
    sales.forEach((sale) => {
      if (!productSales[sale.productId]) {
        productSales[sale.productId] = {
          productName: sale.productName,
          totalQuantity: 0,
          totalAmount: 0,
        };
      }
      productSales[sale.productId].totalQuantity += Number(sale.quantity);
      productSales[sale.productId].totalAmount += Number(sale.total);
    });
    return Object.values(productSales);
  };

  const getSalesPerCategory = () => {
    const categorySales = {};
    sales.forEach((sale) => {
      const product = products.find((p) => p.id === sale.productId);
      if (product) {
        const category = product.category || "Uncategorized";
        if (!categorySales[category]) {
          categorySales[category] = { totalQuantity: 0, totalAmount: 0 };
        }
        categorySales[category].totalQuantity += Number(sale.quantity);
        categorySales[category].totalAmount += Number(sale.total);
      }
    });
    return Object.entries(categorySales).map(([category, data]) => ({
      category,
      ...data,
    }));
  };

  const getOverallTotals = () => {
    const totalSales = sales.reduce(
      (total, sale) => total + Number(sale.total),
      0
    );
    const totalQuantity = sales.reduce(
      (total, sale) => total + Number(sale.quantity),
      0
    );
    return { totalSales, totalQuantity };
  };

  const salesPerProduct = getSalesPerProduct();
  const salesPerCategory = getSalesPerCategory();
  const overallTotals = getOverallTotals();

  if (loading) {
    return (
      <div className="reports-container">
        <h2 className="page-title">Sales Reports</h2>
        <p>Loading reports...</p>
      </div>
    );
  }

  return (
    <div className="reports-container">
      <h2 className="page-title">Sales Reports</h2>

      <div className="summary-cards" style={{ display: "flex", gap: "1rem" }}>
        <div className="card" style={{ flex: 1 }}>
          <div className="card-body">
            <h3 className="card-title">Total Sales Amount</h3>
            <p className="card-text summary-value">
              M{overallTotals.totalSales.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="card" style={{ flex: 1 }}>
          <div className="card-body">
            <h3 className="card-title">Total Products Sold</h3>
            <p className="card-text summary-value">
              {overallTotals.totalQuantity}
            </p>
          </div>
        </div>

        <div className="card" style={{ flex: 1 }}>
          <div className="card-body">
            <h3 className="card-title">Total Transactions</h3>
            <p className="card-text summary-value">{sales.length}</p>
          </div>
        </div>
      </div>

      <div className="report-section">
        <h3>Sales per Product</h3>
        <div className="table-container">
          <table className="report-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Quantity Sold</th>
                <th>Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {salesPerProduct.map((product, index) => (
                <tr key={index}>
                  <td>{product.productName}</td>
                  <td>{product.totalQuantity}</td>
                  <td>M{product.totalAmount.toFixed(2)}</td>
                </tr>
              ))}
              {salesPerProduct.length === 0 && (
                <tr>
                  <td colSpan="3" className="empty-message">
                    No sales data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="report-section">
        <h3>Sales per Category</h3>
        <div className="table-container">
          <table className="report-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Quantity Sold</th>
                <th>Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {salesPerCategory.map((category, index) => (
                <tr key={index}>
                  <td>{category.category}</td>
                  <td>{category.totalQuantity}</td>
                  <td>M{category.totalAmount.toFixed(2)}</td>
                </tr>
              ))}
              {salesPerCategory.length === 0 && (
                <tr>
                  <td colSpan="3" className="empty-message">
                    No category sales data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="report-section">
        <h3>Recent Sales Transactions</h3>
        <div className="table-container">
          <table className="report-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {sales.slice(-10).reverse().map((sale, index) => (
                <tr key={index}>
                  <td>{new Date(sale.date).toLocaleDateString()}</td>
                  <td>{sale.productName}</td>
                  <td>{sale.quantity}</td>
                  <td>M{sale.price}</td>
                  <td>M{sale.total}</td>
                </tr>
              ))}
              {sales.length === 0 && (
                <tr>
                  <td colSpan="5" className="empty-message">
                    No sales transactions recorded.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Reports;
