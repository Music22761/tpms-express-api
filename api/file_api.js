import express from "express";
import multer from "multer";
import { conn } from '../connectdb.js'
import path from "path";
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "../filebase_con.js";

export const router = express.Router();

const upload = multer();

router.get("/", (req, res) => {
    res.send("KuyRaiSas")
});

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

router.post("/pdf/", upload.single("file"), async (req, res) => {
    try {
        // เรียกใช้งานฟังก์ชัน firebaseUpload เพื่ออัปโหลดไฟล์
        const url = await firebaseUploadPDF(req.file);
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

async function firebaseUploadPDF(file) {
    try {
        // สร้างชื่อไฟล์ที่ไม่ซ้ำกันโดยใช้ timestamp และเลขสุ่ม
        const filename = Date.now() + "-" + Math.round(Math.random() * 1000) + ".pdf"; // เปลี่ยนเป็น ".pdf"
        // กำหนด Reference ให้กับไฟล์ที่จะอัปโหลด
        const storageRef = ref(storage, "/pdfs/" + filename); // เปลี่ยนเป็น "/pdfs/"
        // กำหนด Metadata สำหรับไฟล์
        const metadata = { contentType: file.mimetype };
        // เริ่มกระบวนการอัปโหลด
        const snapshot = await uploadBytesResumable(storageRef, file.buffer, metadata);
        // ดึง URL ของไฟล์ที่อัปโหลดเพื่อนำไปใช้งาน
        const url = await getDownloadURL(snapshot.ref);

        return url;
    } catch (error) {
        // หากเกิดข้อผิดพลาดในขณะอัปโหลด
        console.error("Error uploading PDF:", error);
        throw error; // ส่งข้อผิดพลาดไปยัง caller ของฟังก์ชัน
    }
}

router.delete("/pathImage", (req, res) => {
    const path = req.query.path;
    console.log("In delete func: " + String(path));

    // เรียกใช้ฟังก์ชัน firebaseDeleteImage แบบไม่ต้องรอ
    firebaseDeleteImage(String(path)).catch((error) => {
        console.error("Error deleting image:", error);
    });

    res.status(200).send("Image deletion in progress");
});

router.delete("/pathPDF", (req, res) => {
    const path = req.query.path;
    console.log("In delete func:  " + path);

    // เรียกใช้ฟังก์ชัน firebaseDeletePDF แบบไม่ต้องรอ
    firebaseDeletePDF(String(path)).catch((error) => {
        console.error("Error deleting PDF:", error);
    });

    res.status(200).send("PDF deletion in progress");
});

// ลบรูปภาพใน firebase
async function firebaseDeleteImage(path) {
    try {
        console.log("In firebase Delete:" + path);

        const storageRef = ref(
            storage,
            "/images/" + path.split("/images/")[1].split("?")[0]
        );
        await deleteObject(storageRef);
        console.log("Image deleted successfully");
    } catch (error) {
        console.error("Error deleting image:", error);
        throw error; // ส่งข้อผิดพลาดไปยัง caller ของฟังก์ชัน
    }
}

// ลบ PDF ใน firebase
async function firebaseDeletePDF(path) {
    try {
        console.log("In firebase Delete:" + path);

        const storageRef = ref(
            storage,
            "/pdfs/" + path.split("/pdfs/")[1].split("?")[0]
        );
        await deleteObject(storageRef);
        console.log("PDF deleted successfully");
    } catch (error) {
        console.error("Error deleting PDF:", error);
        throw error; // ส่งข้อผิดพลาดไปยัง caller ของฟังก์ชัน
    }
}