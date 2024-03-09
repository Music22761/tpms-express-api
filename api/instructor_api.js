import express from "express";
import { conn } from "../connectdb.js";
import mysql from "mysql";
import util from "util";

export const router = express.Router();

router.get("/", (req, res) => {
    conn.query("select * from Instructor", (err, result, fields) => {
        res.json(result);
    });
    //   res.send("this is Admin Page")
});

router.get("/id", (req, res) => {
    if (req.query.id) {
      conn.query(
        "select * from Instructor where id = " + req.query.id,
        (err, result, fields) => {
          res.json(result);
        }
      );
    } else {
      res.send("call get in Users with Query Param " + req.query.id);
    }
    //   res.send("this is Admin Page")
  });

  router.post('/', (req, res) => {
    console.log(req.body);
  
    let InstructorData = req.body;
  
    const sql = `INSERT INTO Instructor SET ?`;
    conn.query(sql,InstructorData, (err, result) => {
      if (err) {
        console.error('Error inserting data: ', err);
        res.status(500).send('Error inserting data' + InstructorData);
        return;
      }
  
      console.log('Data inserted successfully');
      res.status(200).send('Data inserted successfully');
    });
  });

  router.put("/edit/:id", async (req, res) => {
    let id = +req.params.id;
    let instructor = req.body;
    let instructorOriginal;
    const queryAsync = util.promisify(conn.query).bind(conn);
  
    let sql = mysql.format("select * from Instructor where id = ?", [id]);
  
    let result = await queryAsync(sql);
    const rawData = JSON.parse(JSON.stringify(result));
    console.log(rawData);
    instructorOriginal = rawData[0];
    console.log(instructorOriginal);
  
    let updateInstructor = { ...instructorOriginal, ...instructor };
    console.log(instructor);
    console.log(updateInstructor);
  
    sql =
      "update  `Instructor` set `email`=?, `password`=?, `name_th`=?, `name_en`=?, `account_name`=?, `profile_picture`=?, `description`=?, `phone_number`=?, `signature`=?, `cv`=?, `qr_code`=?, `status`=? where `id`=?";
    sql = mysql.format(sql, [
      updateInstructor.email,
      updateInstructor.password,
      updateInstructor.name_th,
      updateInstructor.name_en,
      updateInstructor.account_name,
      updateInstructor.profile_picture,
      updateInstructor.description,
      updateInstructor.phone_number,
      updateInstructor.signature,
      updateInstructor.cv,
      updateInstructor.qr_code,
      updateInstructor.status,
      id,
    ]);
    conn.query(sql, (err, result) => {
      if (err) throw err;
      res.status(201).json({ affected_row: result.affectedRows });
    });
  });