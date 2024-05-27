import express from "express";
import { conn } from "../connectdb.js";
import util from "util";

export const router = express.Router();

// Promisify conn.query
const queryAsync = util.promisify(conn.query).bind(conn);

router.get("/", async (req, res) => {
  try {
    const result = await queryAsync("SELECT * FROM Admin");
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching admin data");
  }
});

router.get("/idx", async (req, res) => {
  try {
    if (req.query.id) {
      const sql = "SELECT * FROM Admin WHERE id = ?";
      const result = await queryAsync(mysql.format(sql, [req.query.id]));
      res.json(result);
    } else {
      res.status(400).send("Query parameter 'id' is required");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching admin data by id");
  }
});

router.post('/', async (req, res) => {
  try {
    const adminData = req.body;
    const sql = "INSERT INTO Admin SET ?";
    const result = await queryAsync(sql, adminData);
    console.log('Data inserted successfully');
    res.status(200).send('Data inserted successfully');
  } catch (err) {
    console.error('Error inserting data: ', err);
    res.status(500).send('Error inserting data: ' + JSON.stringify(adminData));
  }
});

