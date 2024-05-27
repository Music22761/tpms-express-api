import express from "express";
import { conn } from "../connectdb.js";
import mysql from "mysql";
import util from "util";

export const router = express.Router();

// Promisify conn.query
const queryAsync = util.promisify(conn.query).bind(conn);

router.get("/", async (req, res) => {
    try {
        const result = await queryAsync("SELECT * FROM Course");
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching courses");
    }
});

router.get("/id", async (req, res) => {
    try {
        if (req.query.id) {
            const sql = mysql.format("SELECT * FROM Course WHERE id = ?", [req.query.id]);
            const result = await queryAsync(sql);
            res.json(result);
        } else {
            res.status(400).send("Query parameter 'id' is required");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching course by id");
    }
});

router.post('/', async (req, res) => {
    try {
        console.log(req.body);
        const courseData = req.body;
        const sql = "INSERT INTO Course SET ?";
        const result = await queryAsync(sql, courseData);
        console.log('Data inserted successfully');
        res.status(200).send('Data inserted successfully');
    } catch (err) {
        console.error('Error inserting data: ', err);
        res.status(500).send('Error inserting data: ' + JSON.stringify(req.body));
    }
});

router.put("/edit/:id", async (req, res) => {
    try {
        const id = +req.params.id;
        const course = req.body;
        const sqlSelect = mysql.format("SELECT * FROM Course WHERE id = ?", [id]);

        const resultSelect = await queryAsync(sqlSelect);
        if (resultSelect.length === 0) {
            return res.status(404).send("Course not found");
        }

        const courseOriginal = resultSelect[0];
        const updateCourse = { ...courseOriginal, ...course };

        const sqlUpdate = mysql.format(
            "UPDATE Course SET name = ?, description = ?, address = ?, capacity = ?, start_date = ?, end_date = ?, type = ?, instructor = ?, organization = ?, status = ? WHERE id = ?",
            [
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
            ]
        );

        const resultUpdate = await queryAsync(sqlUpdate);
        res.status(200).json({ affected_row: resultUpdate.affectedRows });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating course");
    }
});
