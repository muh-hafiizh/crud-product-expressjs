// src/models/productModel.js

import pool from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

/**
 * ✅ CREATE PRODUCT
 */
export const createProduct = async (data) => {
  const { name, picture, supplier_name, unit, stock, specification } = data;
  
  const id = uuidv4();
  const result = await pool.query(
    `INSERT INTO products (id, name, picture, supplier_name, unit, stock, specification, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
     RETURNING *`,
    [id, name, picture, supplier_name, unit, stock, specification]
  );

  return result.rows[0];
};

/**
 * ✅ READ - Get All Products
 */
export const getAllProducts = async () => {
  const result = await pool.query(
    `SELECT * FROM products ORDER BY created_at DESC`
  );
  return result.rows;
};

/**
 * ✅ READ - Get Product by ID
 */
export const getProductById = async (id) => {
  const result = await pool.query(
    `SELECT * FROM products WHERE id = $1`,
    [id]
  );
  return result.rows[0];
};

/**
 * ✅ UPDATE PRODUCT
 */
export const updateProduct = async (id, data) => {
  const fields = Object.keys(data);
  
  if (fields.length === 0) {
    throw new Error("Tidak ada data yang dikirim untuk update.");
  }

  // Tambahkan updated_at secara otomatis
  const setClause = [...fields.map((field, index) => `${field}=$${index + 1}`), 'updated_at=NOW()'].join(", ");
  const query = `UPDATE products SET ${setClause} WHERE id=$${fields.length + 1} RETURNING *`;

  const result = await pool.query(query, [...Object.values(data), id]);
  
  if (result.rows.length === 0) {
    throw new Error("Produk tidak ditemukan.");
  }
  
  return result.rows[0];
};

/**
 * ✅ DELETE PRODUCT
 */
export const deleteProduct = async (id) => {
  const result = await pool.query(
    `DELETE FROM products WHERE id = $1 RETURNING id, name`,
    [id]
  );
  
  if (result.rows.length === 0) {
    throw new Error("Produk tidak ditemukan.");
  }
  
  return { 
    message: "Produk berhasil dihapus.",
    deletedProduct: result.rows[0]
  };
};