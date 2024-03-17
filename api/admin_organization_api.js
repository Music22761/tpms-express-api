import express from "express";
import { conn } from "../connectdb.js";
import mysql from "mysql";
import util from "util";

export const router = express.Router();

router.get("/", (req, res) => {
  conn.query("select * from Admin_Organization", (err, result, fields) => {
    res.json(result);
  });
});

router.get("/id", (req, res) => {
  if (req.query.id) {
    conn.query(
      "select * from Admin_Organization where id = " + req.query.id,
      (err, result, fields) => {
        res.json(result);
      }
    );
  } else {
    res.send("call get in Users with Query Param " + req.query.id);
  }
});

router.get("/notAllow", (req, res) => {
  conn.query(
    "select * from Admin_Organization where status = 0",
    (err, result, fields) => {
      res.json(result);
    }
  );
});

router.post('/', (req, res) => {
  console.log(req.body);

  let AdminOrganization = req.body;

  const sql = `INSERT INTO Admin_Organization SET ?`;
  conn.query(sql, AdminOrganization, (err, result) => {
    if (err) {
      console.error('Error inserting data: ', err);
      res.status(500).send('Error inserting data' + AdminOrganization);
      return;
    }

    console.log('Data inserted successfully');
    res.status(200).send('Data inserted successfully');
  });
});

router.delete("/:id", (req, res) => {
  let id = +req.params.id;
  conn.query("delete from Admin_Organization where id = ?", [id], (err, result) => {
    if (err) throw err;
    res.status(200).json({ affected_row: result.affectedRows });
  });
});


router.put("/edit/:id", async (req, res) => {
  let id = +req.params.id;
  let adminOrganization = req.body;
  let adminOrganizationOriginal;
  const queryAsync = util.promisify(conn.query).bind(conn);

  let sql = mysql.format("select * from Admin_Organization where id = ?", [id]);

  let result = await queryAsync(sql);
  const rawData = JSON.parse(JSON.stringify(result));
  console.log(rawData);
  adminOrganizationOriginal = rawData[0];
  console.log(adminOrganizationOriginal);

  let updateAdminOrganization = { ...adminOrganizationOriginal, ...adminOrganization };
  console.log(adminOrganization);
  console.log(updateAdminOrganization);

  sql =
    "update  `Admin_Organization` set `email`=?, `password`=?, `address`=?, `organization_name`=?, `organization_profile_picture`=?, `organization_address`=?, `organization_description`=?, `organization_phone_number`=?, `organization_signature`=?, `qr_code`=?, `status`=? where `id`=?";
  sql = mysql.format(sql, [
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
  ]);
  conn.query(sql, (err, result) => {
    if (err) throw err;
    res.status(201).json({ affected_row: result.affectedRows });
  });
});