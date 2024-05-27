import express from "express";
import { conn } from "../connectdb.js";
import mysql from "mysql";
import util from "util";

export const router = express.Router();

// Utility function to promisify conn.query
const queryAsync = util.promisify(conn.query).bind(conn);

router.get("/", async (req, res) => {
  try {
    const result = await queryAsync("SELECT * FROM User");
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching users");
  }
});

router.get("/idx", async (req, res) => {
  try {
    if (req.query.id) {
      const sql = "SELECT * FROM User WHERE id = ?";
      const result = await queryAsync(mysql.format(sql, [req.query.id]));
      res.json(result);
    } else {
      res.send("Call GET in Users with Query Param " + req.query.id);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching user by id");
  }
  
});

router.post("/", async (req, res) => {
  try {
    const user = req.body;
    const sql = "INSERT INTO User SET ?";
    const result = await queryAsync(sql, user);
    console.log("Data inserted successfully");
    res.status(200).send("Data inserted successfully");
  } catch (err) {
    console.error("Error inserting data: ", err);
    res.status(500).send("Error inserting data: " + JSON.stringify(req.body));
  }
});

router.put("/edit/:id", async (req, res) => {
  try {
    const id = +req.params.id;
    const user = req.body;

    let sql = mysql.format("SELECT * FROM User WHERE id = ?", [id]);
    const result = await queryAsync(sql);

    if (result.length === 0) {
      return res.status(404).send("User not found");
    }

    const userOriginal = result[0];
    const updateUser = { ...userOriginal, ...user };

    sql = `
      UPDATE User 
      SET email = ?, password = ?, name_th = ?, name_en = ?, account_name = ?, profile_picture = ?, qr_code = ?, role = ? 
      WHERE id = ?
    `;
    const formattedSql = mysql.format(sql, [
      updateUser.email,
      updateUser.password,
      updateUser.name_th,
      updateUser.name_en,
      updateUser.account_name,
      updateUser.profile_picture,
      updateUser.qr_code,
      updateUser.role,
      id,
    ]);

    const updateResult = await queryAsync(formattedSql);
    res.status(200).json({ affected_row: updateResult.affectedRows });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating user");
  }
});



