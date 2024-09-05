import express from "express";
import {register, login,getemployee,update,uploadCertificates, downloadFile} from "./controller.js";
import auth from "./authmiddleware.js";

const router = express.Router();

router.post("/create", register);

router.post("/login", login);

router.get("/getemployee", auth, getemployee);


router.post("/update", auth, uploadCertificates, update);

router.get('/uploads/:filename', downloadFile);

export default router;
