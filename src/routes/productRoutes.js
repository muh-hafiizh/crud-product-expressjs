// src/routes/productRoutes.js

import express from "express";
import {
  addProduct,
  getProducts,
  getProduct,
  editProduct,
  removeProduct,
} from "../controllers/productController.js";

// buat instance router dari express
const router = express.Router();

/**
 * 🧩 Daftar Endpoint
 *
 * GET    /api/products          → ambil semua produk
 * GET    /api/products/:id      → ambil 1 produk berdasarkan ID
 * POST   /api/products          → tambah produk baru
 * PUT    /api/products/:id      → ubah data produk
 * DELETE /api/products/:id      → hapus produk
 */

// CREATE - Tambah produk
router.post("/", addProduct);

// READ - Ambil semua produk
router.get("/", getProducts);

// READ - Ambil satu produk by ID
router.get("/:id", getProduct);

// UPDATE - Ubah produk
router.put("/:id", editProduct);

// DELETE - Hapus produk
router.delete("/:id", removeProduct);

export default router;
