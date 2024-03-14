

import express from "express";
import multer from "multer";
import mysql from 'mysql'
import { conn } from '../connectdb.js'
import path from "path";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from "../filebase_con.js";
import { storage } from "../filebase_con.js";


export const router = express.Router();

const upload = multer();

router.get("/", (req, res) => {
    res.send("KuyRaiSas")
})

router.post("/", upload.single("file"), async (req, res) => {
    try {
        // เรียกใช้งานฟังก์ชัน firebaseUpload เพื่ออัปโหลดไฟล์
        const url = await firebaseUpload(req.file);
        // ส่ง URL กลับไปยังผู้ใช้
        res.json({ url: url });
    } catch (error) {
        // หากเกิดข้อผิดพลาดในขณะอัปโหลด
        console.error("Error uploading file:", error);
        res.status(500).json({ error: "Failed to upload file" });
    }
});


async function firebaseUpload(file) {
    try {
        // สร้างชื่อไฟล์ที่ไม่ซ้ำกันโดยใช้ timestamp และเลขสุ่ม
        const filename = Date.now() + "-" + Math.round(Math.random() * 1000) + ".png";
        // กำหนด Reference ให้กับไฟล์ที่จะอัปโหลด
        const storageRef = ref(storage, "/images/" + filename);
        // กำหนด Metadata สำหรับไฟล์
        const metadata = { contentType: file.mimetype };
        // เริ่มกระบวนการอัปโหลด
        const snapshot = await uploadBytesResumable(storageRef, file.buffer, metadata);
        // ดึง URL ของไฟล์ที่อัปโหลดเพื่อนำไปใช้งาน
        const url = await getDownloadURL(snapshot.ref);

        return url;
    } catch (error) {
        // หากเกิดข้อผิดพลาดในขณะอัปโหลด
        console.error("Error uploading image:", error);
        throw error; // ส่งข้อผิดพลาดไปยัง caller ของฟังก์ชัน
    }
}