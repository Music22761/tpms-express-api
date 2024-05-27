import express from "express";
import { conn } from "../connectdb.js";
import mysql from "mysql";
import util from "util";

export const router = express.Router();

// Promisify conn.query
const queryAsync = util.promisify(conn.query).bind(conn);

router.get("/", async (req, res) => {
  try {
    const result = await queryAsync("SELECT * FROM Admin_Organization");
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching admin organizations");
  }
});

router.get("/id", async (req, res) => {
  try {
    if (req.query.id) {
      const sql = mysql.format("SELECT * FROM Admin_Organization WHERE id = ?", [req.query.id]);
      const result = await queryAsync(sql);
      res.json(result);
    } else {
      res.status(400).send("Query parameter 'id' is required");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching admin organization by id");
  }
});

router.get("/notAllow", async (req, res) => {
  try {
    const result = await queryAsync("SELECT * FROM Admin_Organization WHERE status = 0");
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching not allowed admin organizations");
  }
});

router.post('/', async (req, res) => {
  try {
    console.log(req.body);
    const adminOrganization = req.body;
    const sql = "INSERT INTO Admin_Organization SET ?";
    const result = await queryAsync(sql, adminOrganization);
    console.log('Data inserted successfully');
    res.status(200).send('Data inserted successfully');
  } catch (err) {
    console.error('Error inserting data: ', err);
    res.status(500).send('Error inserting data: ' + JSON.stringify(req.body));
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = +req.params.id;
    const sql = mysql.format("DELETE FROM Admin_Organization WHERE id = ?", [id]);
    const result = await queryAsync(sql);
    res.status(200).json({ affected_row: result.affectedRows });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting admin organization");
  }
});

router.put("/edit/:id", async (req, res) => {
  try {
    const id = +req.params.id;
    const adminOrganization = req.body;
    const sqlSelect = mysql.format("SELECT * FROM Admin_Organization WHERE id = ?", [id]);
    
    const resultSelect = await queryAsync(sqlSelect);
    if (resultSelect.length === 0) {
      return res.status(404).send("Admin organization not found");
    }

    const adminOrganizationOriginal = resultSelect[0];
    const updateAdminOrganization = { ...adminOrganizationOriginal, ...adminOrganization };

    const sqlUpdate = mysql.format(
      "UPDATE Admin_Organization SET email = ?, password = ?, address = ?, organization_name = ?, organization_profile_picture = ?, organization_address = ?, organization_description = ?, organization_phone_number = ?, organization_signature = ?, qr_code = ?, status = ? WHERE id = ?",
      [
        updateAdminOrganization.email,
        updateAdminOrganization.password,
        updateAdminOrganization.address,
        updateAdminOrganization.organization_name,
        updateAdminOrganization.organization_profile_picture,
        updateAdminOrganization.organization_address,
        updateAdminOrganization.organization_description,
        updateAdminOrganization.organization_phone_number,
        updateAdminOrganization.organization_signature,
        updateAdminOrganization.qr_code,
        updateAdminOrganization.status,
        id,
      ]
    );

    const resultUpdate = await queryAsync(sqlUpdate);
    res.status(200).json({ affected_row: resultUpdate.affectedRows });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating admin organization");
  }
});
