import express from "express";
import { conn } from "../connectdb.js";
import mysql from "mysql";
import util from "util";

export const router = express.Router();

router.get("/", (req, res) => {
    conn.query("select * from Document", (err, result, fields) => {
        res.json(result);
    });
});

router.get("/id", (req, res) => {
    if (req.query.id) {
        conn.query(
            "select * from Document where id = " + req.query.id,
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

    let DocumentData = req.body;

    const sql = `INSERT INTO Document SET ?`;
    conn.query(sql, DocumentData, (err, result) => {
        if (err) {
            console.error('Error inserting data: ', err);
            res.status(500).send('Error inserting data' + DocumentData);
            return;
        }

        console.log('Data inserted successfully');
        res.status(200).send('Data inserted successfully');
    });
});

router.put("/edit/:id", async (req, res) => {
    let id = +req.params.id;
    let document = req.body;
    let documentOriginal;
    const queryAsync = util.promisify(conn.query).bind(conn);

    let sql = mysql.format("select * from Document where id = ?", [id]);

    let result = await queryAsync(sql);
    const rawData = JSON.parse(JSON.stringify(result));
    console.log(rawData);
    documentOriginal = rawData[0];
    console.log(documentOriginal);

    let updateDocument = { ...documentOriginal, ...document };
    console.log(updateDocument);
    console.log(updateDocument);

    sql =
        "update  `Document` set `document`=?, `course`=? where `id`=?";
    sql = mysql.format(sql, [
        updateDocument.document,
        updateDocument.course,
        id,
    ]);
    conn.query(sql, (err, result) => {
        if (err) throw err;
        res.status(201).json({ affected_row: result.affectedRows });
    });
});