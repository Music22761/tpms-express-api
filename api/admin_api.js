import express from "express";
import { conn } from "../connectdb.js";
import mysql from "mysql";
import util from "util";

export const router = express.Router();

router.get("/", (req, res) => {
  conn.query("select * from Admin", (err, result, fields) => {
    res.json(result);
  });
//   res.send("this is Admin Page")
});

router.get("/idx", (req, res) => {
  conn.query("select * from Admin where"+req.query.id, (err, result, fields) => {
    res.json(result);
  });
//   res.send("this is Admin Page")
});

router.post('/', (req, res) => {
    // รับข้อมูลจาก request body
    // const { email, password, role } = req.body;
    // res.send(email + " " + password + " " + role)
  
    console.log(req.body);

    const adminData = req.body;


    // สร้างคำสั่ง SQL เพื่อเพิ่มข้อมูลผู้ใช้
    const sql = `INSERT INTO Admin SET ?`;

  
    // Execute the SQL statement
    conn.query(sql, adminData, (err, result) => {
      if (err) {
        console.error('Error inserting data: ', err);
        res.status(500).send('Error inserting data' + adminData);
        return;
      }
  
      console.log('Data inserted successfully');
      res.status(200).send('Data inserted successfully');
    });
  });