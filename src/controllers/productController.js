// src/controllers/productController.js

import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../models/productModel.js";

import validator from "validator";

/**
 * Validasi input produk
 */
const validateProductInput = (data, isUpdate = false) => {
  const errors = [];

  if (!isUpdate || data.name !== undefined) {
    if (!data.name || data.name.trim().length === 0) {
      errors.push("Nama produk wajib diisi");
    } else if (data.name.length > 255) {
      errors.push("Nama produk maksimal 255 karakter");
    }
  }

  if (!isUpdate || data.stock !== undefined) {
    if (data.stock === undefined || data.stock === null) {
      errors.push("Stock wajib diisi");
    } else if (!Number.isInteger(Number(data.stock)) || data.stock < 0) {
      errors.push("Stock harus bilangan bulat positif");
    }
  }

  if (data.supplier_name && data.supplier_name.length > 255) {
    errors.push("Nama supplier maksimal 255 karakter");
  }

  if (data.unit && data.unit.length > 50) {
    errors.push("Unit maksimal 50 karakter");
  }

  return errors;
};

/**
 * Sanitize data input
 */
const sanitizeProductData = (data) => {
  const sanitized = {};
  
  if (data.name) sanitized.name = validator.escape(data.name.trim());
  if (data.picture) sanitized.picture = validator.escape(data.picture.trim());
  if (data.supplier_name) sanitized.supplier_name = validator.escape(data.supplier_name.trim());
  if (data.unit) sanitized.unit = validator.escape(data.unit.trim());
  if (data.stock !== undefined) sanitized.stock = parseInt(data.stock);
  if (data.specification) sanitized.specification = validator.escape(data.specification.trim());

  return sanitized;
};

/**
 * ✅ CREATE - Tambah produk baru
 */
export const addProduct = async (req, res) => {
  try {
    const { name, picture, supplier_name, unit, stock, specification } = req.body;

    // Validasi input
    const validationErrors = validateProductInput({ name, stock, supplier_name, unit });
    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        message: "Validasi gagal",
        errors: validationErrors 
      });
    }

    const safeData = sanitizeProductData({
      name, picture, supplier_name, unit, stock, specification
    });

    const newProduct = await createProduct(safeData);
    
    return res.status(201).json({
      message: "Produk berhasil ditambahkan.",
      data: newProduct,
    });
  } catch (err) {
    console.error("Add product error:", err);
    return res.status(500).json({ 
      message: "Terjadi kesalahan server" 
    });
  }
};

/**
 * ✅ READ - Ambil semua produk
 */
export const getProducts = async (req, res) => {
  try {
    const products = await getAllProducts();
    return res.status(200).json({
      data: products,
      count: products.length
    });
  } catch (err) {
    console.error("Get products error:", err);
    return res.status(500).json({ 
      message: "Terjadi kesalahan server" 
    });
  }
};

/**
 * ✅ READ - Ambil satu produk berdasarkan ID
 */
export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!validator.isUUID(id)) {
      return res.status(400).json({ message: "ID tidak valid." });
    }

    const product = await getProductById(id);
    if (!product) {
      return res.status(404).json({ message: "Produk tidak ditemukan." });
    }

    return res.status(200).json(product);
  } catch (err) {
    console.error("Get product error:", err);
    return res.status(500).json({ 
      message: "Terjadi kesalahan server" 
    });
  }
};

/**
 * ✅ UPDATE - Ubah data produk
 */
export const editProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!validator.isUUID(id)) {
      return res.status(400).json({ message: "ID tidak valid." });
    }

    const { name, picture, supplier_name, unit, stock, specification } = req.body;

    // Validasi input untuk update
    const validationErrors = validateProductInput(
      { name, stock, supplier_name, unit }, 
      true
    );
    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        message: "Validasi gagal",
        errors: validationErrors 
      });
    }

    const updateData = sanitizeProductData({
      name, picture, supplier_name, unit, stock, specification
    });

    // Hapus field yang undefined
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ 
        message: "Tidak ada data yang diupdate" 
      });
    }

    const updatedProduct = await updateProduct(id, updateData);
    
    return res.status(200).json({
      message: "Produk berhasil diperbarui.",
      data: updatedProduct,
    });
  } catch (err) {
    console.error("Update product error:", err);
    
    if (err.message === "Produk tidak ditemukan.") {
      return res.status(404).json({ message: err.message });
    }
    
    return res.status(500).json({ 
      message: "Terjadi kesalahan server" 
    });
  }
};

/**
 * ✅ DELETE - Hapus produk
 */
export const removeProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!validator.isUUID(id)) {
      return res.status(400).json({ message: "ID tidak valid." });
    }

    const result = await deleteProduct(id);
    return res.status(200).json(result);
  } catch (err) {
    console.error("Delete product error:", err);
    
    if (err.message === "Produk tidak ditemukan.") {
      return res.status(404).json({ message: err.message });
    }
    
    return res.status(500).json({ 
      message: "Terjadi kesalahan server" 
    });
  }
};