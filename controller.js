import Employee from "./model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import fs from "fs";
import dotenv from "dotenv"
dotenv.config()

// Multer configuration for multiple file uploads
export const uploadCertificates = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/');
        },
        filename: (req, file, cb) => {
            const extension = path.extname(file.originalname);
            const filename = `${file.fieldname}-${Date.now()}-${file.originalname}`;
            cb(null, filename);
        }
    })
}).fields([
    { name: 'profilePicture', maxCount: 3 }, // Allow up to 3 profile pictures
    { name: 'tenthCertificate', maxCount: 4 }, // Allow up to 4 tenth certificates
    { name: 'twelfthCertificate', maxCount: 2 }, // Allow up to 2 twelfth certificates
    { name: 'ugCertificate', maxCount: 3 } // Allow up to 3 UG certificates
]);

// Register a new employee
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const employee = new Employee({ name, email, password: hashedPassword });
        await employee.save();
        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

// Login an employee
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const employee = await Employee.findOne({ email });
        if (!employee) {
            return res.status(401).json({ message: "Employee not found" });
        }
        bcrypt.compare(password, employee.password, (err, result) => {
            if (result) {
    
                const token = jwt.sign({ email: employee.email }, process.env.JWT_SECRET, { expiresIn: "10d" })
                return res.status(200).json({ success: true, message: "Login Successfully", token: token })
            }
            return res.status(400).json({ success: false, message: "Password Mismatched" })
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

// Get employee details
export const getemployee = async (req, res) => {
    try {

        const employee = await Employee.findOne({ email: req.body.email });
        if (employee) {
               res.status(200).json(employee);
        } else {
            res.status(404).json({ message: "Employee not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving employee data", error });
    }
};

// Update employee details, including profile picture and certificates
export const update = async (req, res) => {
    try {
        const { email, name, password } = req.body;
        const files = req.files;

        if (!email) {
            return res.status(400).json({ message: "Email is required." });
        }

        const updateData = {
            name,
            password
        };
        

        // Handling file uploads
        if (files) {
            if (files.profilePicture) {
                updateData.profilePicture = `uploads/${files.profilePicture[0].filename}`;
            }
            if (files.tenthCertificate) {
                updateData.tenthCertificate = `uploads/${files.tenthCertificate[0].filename}`;
            }
            if (files.twelfthCertificate) {
                updateData.twelfthCertificate = `uploads/${files.twelfthCertificate[0].filename}`;
            }
            if (files.ugCertificate) {
                updateData.ugCertificate = `uploads/${files.ugCertificate[0].filename}`;
            }
        }

        const employee = await Employee.findOneAndUpdate({ email }, updateData, { new: true });

        if (employee) {
            res.status(200).json({ message: "Employee updated successfully", ...updateData });
        } else {
            res.status(404).json({ message: "Employee not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};
// Update employee details, including profile picture and certificates
// export const update = async (req, res) => {
//     try {
//         const { email, name, password } = req.body;
//         const files = req.files;

//         if (!email) {
//             return res.status(400).json({ message: "Email is required." });
//         }

//         const updateData = {
//             name,
//             password
//         };

//         // Handling file uploads for multiple files
//         if (files) {
//             if (files.profilePicture) {
//                 // Store all uploaded profile pictures
//                 updateData.profilePictures = files.profilePicture.map(file => `uploads/${file.filename}`);
//             }
//             if (files.tenthCertificate) {
//                 // Store all uploaded tenth certificates
//                 updateData.tenthCertificates = files.tenthCertificate.map(file => `uploads/${file.filename}`);
//             }
//             if (files.twelfthCertificate) {
//                 // Store all uploaded twelfth certificates
//                 updateData.twelfthCertificates = files.twelfthCertificate.map(file => `uploads/${file.filename}`);
//             }
//             if (files.ugCertificate) {
//                 // Store all uploaded UG certificates
//                 updateData.ugCertificates = files.ugCertificate.map(file => `uploads/${file.filename}`);
//             }
//         }

//         const employee = await Employee.findOneAndUpdate({ email }, updateData, { new: true });

//         if (employee) {
//             res.status(200).json({message: "Employee updated successfully", ...updateData });
//         } else {
//             res.status(404).json({message: "Employee not found" });
//         }
//     } catch (error) {
//         res.status(500).json({ message: "Internal Server Error", error });
//     }
// };

// Download endpoint
export const downloadFile = (req, res) => {
    const { filename } = req.params;
    const fileLocation = path.join(__dirname, 'uploads', filename);

    if (fs.existsSync(fileLocation)) {
        res.download(fileLocation);
    } else {
        res.status(404).json({ message: "File not found." });
    }
};
