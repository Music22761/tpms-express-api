import express from "express";
import { conn } from "../connectdb.js";
import mysql from "mysql";
import util from "util";

export const router = express.Router();

// Promisify conn.query
const queryAsync = util.promisify(conn.query).bind(conn);

router.get("/", async (req, res) => {
    try {
        const result = await queryAsync("SELECT * FROM Instructor");
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching instructors");
    }
});

router.get("/id", async (req, res) => {
    try {
        if (req.query.id) {
            const sql = mysql.format("SELECT * FROM Instructor WHERE id = ?", [req.query.id]);
            const result = await queryAsync(sql);
            res.json(result);
        } else {
            res.status(400).send("Query parameter 'id' is required");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching instructor by id");
    }
});

router.get("/notAllow", async (req, res) => {
    try {
        const result = await queryAsync("SELECT * FROM Instructor WHERE status = 0");
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching not allowed instructors");
    }
});

router.post('/', async (req, res) => {
    try {
        console.log(req.body);
        const instructorData = req.body;
        const sql = "INSERT INTO Instructor SET ?";
        const result = await queryAsync(sql, instructorData);
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
        const sql = mysql.format("DELETE FROM Instructor WHERE id = ?", [id]);
        const result = await queryAsync(sql);
        res.status(200).json({ affected_row: result.affectedRows });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting instructor");
    }
});

router.put("/edit/:id", async (req, res) => {
    try {
        const id = +req.params.id;
        const instructor = req.body;
        const sqlSelect = mysql.format("SELECT * FROM Instructor WHERE id = ?", [id]);
        
        const resultSelect = await queryAsync(sqlSelect);
        if (resultSelect.length === 0) {
            return res.status(404).send("Instructor not found");
        }

        const instructorOriginal = resultSelect[0];
        const updateInstructor = { ...instructorOriginal, ...instructor };

        const sqlUpdate = mysql.format(
            "UPDATE Instructor SET email = ?, password = ?, name_th = ?, name_en = ?, account_name = ?, profile_picture = ?, description = ?, phone_number = ?, signature = ?, cv = ?, qr_code = ?, status = ? WHERE id = ?",
            [
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
            ]
        );

        const resultUpdate = await queryAsync(sqlUpdate);
        res.status(200).json({ affected_row: resultUpdate.affectedRows });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating instructor");
    }
});