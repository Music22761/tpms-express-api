import express from "express";
import { conn } from "../connectdb.js";
import util from "util";

export const router = express.Router();

// Promisify conn.query
const queryAsync = util.promisify(conn.query).bind(conn);

router.get("/region", async (req, res) => {
    try {
        const result = await queryAsync("SELECT * from geographies");
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching regions");
    }
});

router.get("/province", async (req, res) => {
    try {
        const result = await queryAsync("SELECT * from provinces");
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching provinces");
    }
});

router.get("/district", async (req, res) => {
    try {
        const result = await queryAsync("SELECT * from amphures");
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching districts");
    }
});

router.get("/subDistrict", async (req, res) => {
    try {
        const result = await queryAsync("SELECT * from districts");
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching sub-districts");
    }
});
