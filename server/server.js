import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import admin from "firebase-admin";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const serviceAccount = require("./service-account.json");

dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore(); 
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer Setup
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_'))
    }
});
const upload = multer({ storage: storage });

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 8080;

const verifyToken = async (req, res, next) => {
    const idToken = req.headers.authorization?.split('Bearer ')[1];

    if (!idToken) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.user = decodedToken; // Attach user info to request
        next();
    } catch (error) {
        fs.writeFileSync('debug_error.log', `timestamp: ${new Date().toISOString()}\nerror: ${error.message}\ncode: ${error.code}\nstack: ${error.stack}\n---\n`, { flag: 'a' });
        console.error("Token verification failed:", error);
        return res.status(403).json({ 
            error: 'Unauthorized', 
            details: error.message
        });
    }
};

// 3. Auth Route (Login/Signup)
app.post('/api/auth/login', verifyToken, async (req, res) => {
    const { uid, email, name, picture } = req.user;

    try {
        // Check if user exists in Firestore
        const userRef = db.collection('users').doc(uid);
        const doc = await userRef.get();

        if (!doc.exists) {
            // Create new user in Firestore (Replaces Mongoose User.create)
            await userRef.set({
                email,
                name,
                picture,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                role: 'user' // Default role
            });
        }

        res.json({ message: "User authenticated", user: req.user });
    } catch (error) {
        console.error("Login API Error:", error);
        res.status(500).json({ error: error.message });
    }
});

import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Google AI (Gemini)
// Note: User must set GEMINI_API_KEY in server/.env or environment
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-pro",
    systemInstruction: {
        parts: [{ text: `
You are an expert Senior Legal Counsel specializing in contract law and risk analysis.
Your task is to compare two documents: a "Master Agreement" (Standard) and a "Candidate Contract" (New/Proposed).
Identify contradictory clauses, significant omissions, or risky deviations in the Candidate Contract compared to the Master Agreement.

Output strictly in this JSON format:
{
  "riskScore": number (0-100),
  "conflicts": [
    {
      "id": number,
      "severity": "High" | "Medium" | "Low",
      "category": string,
      "masterText": string (exact quote from Master),
      "candidateText": string (exact quote from Candidate),
      "explanation": string (concise legal reasoning)
    }
  ]
}
Do not include markdown formatting (like \`\`\`json). Just the raw JSON string.
` }]
    },
    generationConfig: { responseMimeType: "application/json" } // Force JSON mode
});

// Helper to encode file to base64
function fileToGenerativePart(path, mimeType) {
    return {
        inlineData: {
            data: fs.readFileSync(path).toString("base64"),
            mimeType,
        },
    };
}

// Phase 2 & 3: Real Analysis Endpoint
app.post('/api/analyze', verifyToken, upload.fields([{ name: 'master', maxCount: 1 }, { name: 'candidate', maxCount: 1 }]), async (req, res) => {
    try {
        const masterFile = req.files['master'] ? req.files['master'][0] : null;
        const candidateFile = req.files['candidate'] ? req.files['candidate'][0] : null;

        if (!masterFile || !candidateFile) {
            return res.status(400).json({ error: "Both 'Master Agreement' and 'Candidate Contract' are required." });
        }

        console.log("Processing files with Gemini (API Key):", masterFile.originalname, candidateFile.originalname);

        // Prepare Inputs
        const masterPart = fileToGenerativePart(masterFile.path, 'application/pdf');
        const candidatePart = fileToGenerativePart(candidateFile.path, 'application/pdf');

        const prompt = [
            "Here is the Master Agreement:",
            masterPart,
            "Here is the Candidate Contract:",
            candidatePart
        ];

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Cleanup JSON (redundant if using responseMimeType, but safe)
        const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const analysisData = JSON.parse(cleanJson);

        console.log("Analysis Complete. Score:", analysisData.riskScore);

        res.status(200).json({ 
            message: "Analysis successful",
            files: {
                master: masterFile.filename,
                candidate: candidateFile.filename
            },
            mockAnalysis: analysisData // Keeping key 'mockAnalysis' for frontend compatibility, though it's real now
        });

    } catch (error) {
        console.error("Vertex AI Error:", error);
        res.status(500).json({ error: "Failed to analyze documents. " + error.message });
    }
});



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
