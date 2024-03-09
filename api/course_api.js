import express from "express";
import { conn } from "../connectdb.js";
import mysql from "mysql";
import util from "util";

export const router = express.Router();

router.get("/", (req, res) => {
    conn.query("select * from Course", (err, result, fields) => {
        res.json(result);
    });
});

router.get("/id", (req, res) => {
    if (req.query.id) {
        conn.query(
            "select * from Course where id = " + req.query.id,
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

    let CourseData = req.body;

    const sql = `INSERT INTO Course SET ?`;
    conn.query(sql, CourseData, (err, result) => {
        if (err) {
            console.error('Error inserting data: ', err);
            res.status(500).send('Error inserting data' + CourseData);
            return;
        }

        console.log('Data inserted successfully');
        res.status(200).send('Data inserted successfully');
    });
});

router.put("/edit/:id", async (req, res) => {
    let id = +req.params.id;
    let course = req.body;
    let courseOriginal;
    const queryAsync = util.promisify(conn.query).bind(conn);

    let sql = mysql.format("select * from Course where id = ?", [id]);

    let result = await queryAsync(sql);
    const rawData = JSON.parse(JSON.stringify(result));
    console.log(rawData);
    courseOriginal = rawData[0];
    console.log(courseOriginal);

    let updateCourse = { ...courseOriginal, ...course };
    console.log(updateCourse);
    console.log(updateCourse);

    sql =
        "update  `Course` set `name`=?, `description`=?, `address`=?, `capacity`=?, `start_date`=?, `end_date`=?, `type`=?, `instructor`=?, `organization`=?, `status`=? where `id`=?";
    sql = mysql.format(sql, [
        updateCourse.name,
        updateCourse.description,
        updateCourse.address,
        updateCourse.capacity,
        updateCourse.start_date,
        updateCourse.end_date,
        updateCourse.type,
        updateCourse.instructor,
        updateCourse.organization,
        updateCourse.status,
        id,
    ]);
    conn.query(sql, (err, result) => {
        if (err) throw err;
        res.status(201).json({ affected_row: result.affectedRows });
    });
});