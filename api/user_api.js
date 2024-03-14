import express from "express";
import { conn } from "../connectdb.js";
import mysql from "mysql";
import util from "util";

export const router = express.Router();

router.get("/", (req, res) => {
  conn.query("select * from User", (err, result, fields) => {
    res.json(result);
  });
  //   res.send("this is Admin Page")
});

router.get("/idx", (req, res) => {
  if (req.query.id) {
    conn.query(
      "select * from User where id = " + req.query.id,
      (err, result, fields) => {
        res.json(result);
      }
    );
  } else {
    res.send("call get in Users with Query Param " + req.query.id);
  }
  //   res.send("this is Admin Page")
});



// router.get("/code/:search", (req, res) => {
//   const search = `%${req.params.search}%`
//   console.log(search)
//   conn.query(
//     "select * from User_En where code like ? or fname like ? or lname like ? or nickname like ?",
//     // "select * from User_En where code like ?",
//     [search, search, search, search],
//     (err, result) => {
//       if(err) {
//         res.json(err)
//       }else {
//         console.log("OK");
//         res.json(result);
//       }
//     }
//   );
// });

router.post('/', (req, res) => {
  console.log(req.body);

  let user = req.body;

  const sql = `INSERT INTO User SET ?`;
  conn.query(sql,user, (err, result) => {
    if (err) {
      console.error('Error inserting data: ', err);
      res.status(500).send('Error inserting data' + user);
      return;
    }

    console.log('Data inserted successfully');
    res.status(200).send('Data inserted successfully');
  });
});

// router.post('/', (req, res) => {
//   console.log(req.body);

//   let uesrData = req.body;

//   // สร้างคำสั่ง SQL เพื่อเพิ่มข้อมูลผู้ใช้
//   let sql = "INSERT INTO `User_En` (`code`, `fname`, `lname`, `type`, `nickname`, `birthday`) VALUES (?,?,?,?,?,?)";
//   sql = mysql.format(sql, [
//     uesrData.code,
//     uesrData.fname,
//     uesrData.lname,
//     uesrData.type,
//     uesrData.nickname,
//     uesrData.birthday,
//   ]);

//   // Execute the SQL statement
//   conn.query(sql, (err, result) => {
//     if (err) {
//       console.error('Error inserting data: ', err);
//       res.status(500).send('Error inserting data' + uesrData);
//       return;
//     }

//     console.log('Data inserted successfully');
//     res.status(200).send('Data inserted successfully');
//   });
// });

router.put("/edit/:id", async (req, res) => {
  let id = +req.params.id;
  let user = req.body;
  let userOriginal;
  const queryAsync = util.promisify(conn.query).bind(conn);

  let sql = mysql.format("select * from User where id = ?", [id]);

  let result = await queryAsync(sql);
  const rawData = JSON.parse(JSON.stringify(result));
  console.log(rawData);
  userOriginal = rawData[0];
  console.log(userOriginal);

  let updateUser = { ...userOriginal, ...user };
  console.log(user);
  console.log(updateUser);

  sql =
    "update  `User` set `email`=?, `password`=?, `name_th`=?, `name_en`=?, `account_name`=?, `profile_picture`=?, `qr_code`=?, `role`=? where `id`=?";
  sql = mysql.format(sql, [
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
  conn.query(sql, (err, result) => {
    if (err) throw err;
    res.status(201).json({ affected_row: result.affectedRows });
  });
});



