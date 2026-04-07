import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import bodyParser from "body-parser";

// --- Types ---
interface Supplier {
  id: number;
  name: string;
  city: string;
}

interface InventoryItem {
  id: number;
  supplier_id: number;
  product_name: string;
  category: string;
  quantity: number;
  price: number;
}

// Basic data storage in memory for now
// In a real app we'd use a proper database like MongoDB or SQL
let suppliers: Supplier[] = [
  { id: 1, name: "Global Tech", city: "Mumbai" },
  { id: 2, name: "Office Solutions", city: "Delhi" },
  { id: 3, name: "Build-It Corp", city: "Bangalore" }
];

let inventory: InventoryItem[] = [
  { id: 1, supplier_id: 1, product_name: "Mechanical Keyboard", category: "Electronics", quantity: 50, price: 4500 },
  { id: 2, supplier_id: 1, product_name: "Gaming Mouse", category: "Electronics", quantity: 120, price: 2500 },
  { id: 3, supplier_id: 2, product_name: "Ergonomic Chair", category: "Furniture", quantity: 15, price: 12000 },
  { id: 4, supplier_id: 2, product_name: "Standing Desk", category: "Furniture", quantity: 8, price: 25000 },
  { id: 5, supplier_id: 3, product_name: "Steel Beam", category: "Construction", quantity: 200, price: 1500 },
  { id: 6, supplier_id: 3, product_name: "Cement Bag", category: "Construction", quantity: 500, price: 450 },
  { id: 7, supplier_id: 1, product_name: "USB-C Cable", category: "Electronics", quantity: 300, price: 800 },
  { id: 8, supplier_id: 2, product_name: "Whiteboard", category: "Furniture", quantity: 20, price: 3500 },
  { id: 9, supplier_id: 3, product_name: "Safety Helmet", category: "Construction", quantity: 100, price: 1200 },
  { id: 10, supplier_id: 1, product_name: "Monitor Stand", category: "Electronics", quantity: 40, price: 3200 }
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(bodyParser.json());

// Main search endpoint
  app.get("/api/search", (req, res) => {
    console.log("Search request received:", req.query);
    const { q, category, minPrice, maxPrice } = req.query;

    let filteredData = [...inventory];

    // Search by name (case insensitive)
    if (q) {
      const searchTerm = String(q).toLowerCase();
      filteredData = filteredData.filter(item => 
        item.product_name.toLowerCase().includes(searchTerm)
      );
    }

    // Filter by category if one is selected
    if (category && category !== "All") {
      filteredData = filteredData.filter(item => 
        item.category.toLowerCase() === String(category).toLowerCase()
      );
    }

    // Price range checks
    const min = minPrice ? parseFloat(String(minPrice)) : null;
    const max = maxPrice ? parseFloat(String(maxPrice)) : null;

    if (min !== null && max !== null && min > max) {
      console.log("Error: min price > max price");
      return res.status(400).json({ error: "Invalid price range: minPrice cannot be greater than maxPrice" });
    }

    if (min !== null) {
      filteredData = filteredData.filter(item => item.price >= min);
    }

    if (max !== null) {
      filteredData = filteredData.filter(item => item.price <= max);
    }

    // Attach supplier names to the items
    const finalResults = filteredData.map(item => {
      const supplier = suppliers.find(s => s.id === item.supplier_id);
      return { ...item, supplier_name: supplier ? supplier.name : "Unknown" };
    });

    res.json(finalResults);
  });

  // Add a new supplier
  app.post("/api/supplier", (req, res) => {
    console.log("Adding new supplier:", req.body);
    const { name, city } = req.body;
    
    if (!name || !city) {
      return res.status(400).json({ error: "Name and City are required" });
    }

    const newSupplier: Supplier = {
      id: suppliers.length + 1,
      name,
      city
    };

    suppliers.push(newSupplier);
    res.status(201).json(newSupplier);
  });

  // Add new inventory item
  app.post("/api/inventory", (req, res) => {
    console.log("Adding new inventory item:", req.body);
    const { supplier_id, product_name, category, quantity, price } = req.body;

    // Basic validation
    if (!supplier_id || !product_name || !category) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const supplierExists = suppliers.some(s => s.id === parseInt(String(supplier_id)));
    if (!supplierExists) {
      return res.status(400).json({ error: "Inventory must belong to a valid supplier" });
    }

    if (quantity < 0) {
      return res.status(400).json({ error: "Quantity must be 0 or more" });
    }

    if (price <= 0) {
      return res.status(400).json({ error: "Price must be greater than 0" });
    }

    const newItem: InventoryItem = {
      id: inventory.length + 1,
      supplier_id: parseInt(String(supplier_id)),
      product_name,
      category,
      quantity: parseInt(String(quantity)),
      price: parseFloat(String(price))
    };

    inventory.push(newItem);
    res.status(201).json(newItem);
  });

  // GET /inventory (All items)
  app.get("/api/inventory", (req, res) => {
    const itemsWithSupplier = inventory.map(item => {
      const supplier = suppliers.find(s => s.id === item.supplier_id);
      return { ...item, supplier_name: supplier ? supplier.name : "Unknown" };
    });
    res.json(itemsWithSupplier);
  });

  // GET /suppliers (Helper for dropdowns)
  app.get("/api/suppliers", (req, res) => {
    res.json(suppliers);
  });

  // Get inventory grouped by supplier for analytics
  app.get("/api/inventory/grouped", (req, res) => {
    console.log("Fetching grouped inventory data");
    const grouped = suppliers.map(supplier => {
      const supplierItems = inventory.filter(item => item.supplier_id === supplier.id);
      const totalValue = supplierItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
      return {
        supplier_id: supplier.id,
        supplier_name: supplier.name,
        total_value: totalValue,
        item_count: supplierItems.length
      };
    });

    // Sort by value descending
    grouped.sort((a, b) => b.total_value - a.total_value);

    res.json(grouped);
  });

  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
