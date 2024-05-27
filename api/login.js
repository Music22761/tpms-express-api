import express from "express";
import { conn } from "../connectdb.js";
import mysql from "mysql";
import util from "util";

export const router = express.Router();

router.get("/", (req, res) => {
    conn.query(`SELECT 
    COALESCE(A.ID, AO.ID, I.ID, U.ID) AS id,
    COALESCE(A.email, AO.email, I.email, U.email) AS email,
    COALESCE(A.password, AO.password, I.password, U.password) AS password,
    COALESCE(A.role, AO.role, I.role, U.role) AS role,
    COALESCE(U.status, A.status, AO.status, I.status) AS status
FROM 
    Admin A
LEFT JOIN 
    Admin_Organization AO ON A.email = AO.email
LEFT JOIN 
    Instructor I ON A.email = I.email
LEFT JOIN 
    User U ON A.email = U.email
UNION
SELECT 
    COALESCE(A.ID, AO.ID, I.ID, U.ID) AS id,
    COALESCE(AO.email, A.email, I.email, U.email) AS email,
    COALESCE(AO.password, A.password, I.password, U.password) AS password,
    COALESCE(AO.role, A.role, I.role, U.role) AS role,
    COALESCE(U.status, A.status, AO.status, I.status) AS status
FROM 
    Admin_Organization AO
LEFT JOIN 
    Admin A ON AO.email = A.email
LEFT JOIN 
    Instructor I ON AO.email = I.email
LEFT JOIN 
    User U ON AO.email = U.email
UNION
SELECT 
    COALESCE(A.ID, AO.ID, I.ID, U.ID) AS id,
    COALESCE(I.email, A.email, AO.email, U.email) AS email,
    COALESCE(I.password, A.password, AO.password, U.password) AS password,
    COALESCE(I.role, A.role, AO.role, U.role) AS role,
    COALESCE(U.status, A.status, AO.status, I.status) AS status
FROM 
    Instructor I
LEFT JOIN 
    Admin A ON I.email = A.email
LEFT JOIN 
    Admin_Organization AO ON I.email = AO.email
LEFT JOIN 
    User U ON I.email = U.email
UNION
SELECT 
    COALESCE(U.ID, A.ID, AO.ID, I.ID) AS id,
    COALESCE(U.email, A.email, AO.email, I.email) AS email,
    COALESCE(U.password, A.password, AO.password, I.password) AS password,
    COALESCE(U.role, A.role, AO.role, I.role) AS role,
    COALESCE(U.status, A.status, AO.status, I.status) AS status
FROM 
    User U
LEFT JOIN 
    Admin A ON U.email = A.email
LEFT JOIN 
    Admin_Organization AO ON U.email = AO.email
LEFT JOIN 
    Instructor I ON U.email = I.email;
`, (err, result, fields) => {
        res.json(result);
    });
});