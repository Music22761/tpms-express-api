import express from "express";
import { conn } from "../connectdb.js";
import mysql from "mysql";
import util from "util";

export const router = express.Router();

router.get("/region", (req, res) => {
    conn.query("SELECT * from geographies", (err, result, fields) => {
        res.json(result);
    });
});

router.get("/province", (req, res) => {
    conn.query("SELECT * from provinces", (err, result, fields) => {
        res.json(result);
    });
});

router.get("/district", (req, res) => {
    conn.query("SELECT * from amphures", (err, result, fields) => {
        res.json(result);
    });
});

router.get("/subDistrict", (req, res) => {
    conn.query("SELECT * from districts", (err, result, fields) => {
        res.json(result);
    });
});