import express from "express";
import { conn } from "../connectdb.js";
import mysql from "mysql";
import util from "util";

export const router = express.Router();

router.get("/", (req, res) => {
    conn.query("select * from Enrollment", (err, result, fields) => {
        res.json(result);
    });
});

router.get("/id", (req, res) => {
    if (req.query.id) {
        conn.query(
            "select * from Enrollment where id = " + req.query.id,
            (err, result, fields) => {
                res.json(result);
            }
        );
    } else {
        res.send("call get in Users with Query Param " + req.query.id);
    }
});

router.post('/', (req, res) => {
    console.log(req.body);

    let EnrollmentData = req.body;

    const sql = `INSERT INTO Enrollment SET ?`;
    conn.query(sql, EnrollmentData, (err, result) => {
        if (err) {
            console.error('Error inserting data: ', err);
            res.status(500).send('Error inserting data' + EnrollmentData);
            return;
        }

        console.log('Data inserted successfully');
        res.status(200).send('Data inserted successfully');
    });
});

router.put("/edit/:id", async (req, res) => {
    let id = +req.params.id;
    let enrollment = req.body;
    let enrollmentOriginal;
    const queryAsync = util.promisify(conn.query).bind(conn);

    let sql = mysql.format("select * from Enrollment where id = ?", [id]);

    let result = await queryAsync(sql);
    const rawData = JSON.parse(JSON.stringify(result));
    console.log(rawData);
    enrollmentOriginal = rawData[0];
    console.log(enrollmentOriginal);

    let updateEnrollment = { ...enrollmentOriginal, ...enrollment };
    console.log(updateEnrollment);
    console.log(updateEnrollment);

    sql =
        "update  `Enrollment` set `certificate`=?, `user`=?, `course`=?, `status`=? where `id`=?";
    sql = mysql.format(sql, [
        updateEnrollment.certificate,
        updateEnrollment.user,
        updateEnrollment.course,
        updateEnrollment.status,
        id,
    ]);
    conn.query(sql, (err, result) => {
        if (err) throw err;
        res.status(201).json({ affected_row: result.affectedRows });
    });
});