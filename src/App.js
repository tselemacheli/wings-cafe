import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Products from './components/Products';
import StockManagement from './components/StockManagement';
import Sales from './components/Sales';
import Reports from './components/Reports';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Navigation */}
        <nav>
          <h1>Wings Cafe</h1>
          <ul>
            <li>
              <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Dashboard</NavLink>
            </li>
            <li>
              <NavLink to="/products" className={({ isActive }) => isActive ? 'active' : ''}>Products</NavLink>
            </li>
            <li>
              <NavLink to="/stock" className={({ isActive }) => isActive ? 'active' : ''}>Stock Management</NavLink>
            </li>
            <li>
              <NavLink to="/sales" className={({ isActive }) => isActive ? 'active' : ''}>Sales</NavLink>
            </li>
            <li>
              <NavLink to="/reports" className={({ isActive }) => isActive ? 'active' : ''}>Reports</NavLink>
            </li>
          </ul>
        </nav>

        {/* Main content */}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/stock" element={<StockManagement />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>

        {/* Footer */}
        <footer className="footer">
          <p>&copy; {new Date().getFullYear()} Wings Cafe.by. Ts'ele P Macheli All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
