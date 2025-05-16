const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = 3002;
const DATA_DIR = "./data";

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
}

// API to save mock response
app.post("/save", (req, res) => {
    const { httpStatus, contentType, charset, headers, responseBody } = req.body;
    if (!httpStatus || !contentType || !responseBody) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const id = uuidv4();
    const mockData = { httpStatus, contentType, charset, headers, responseBody };

    // Save the mock response to a file
    fs.writeFileSync(`${DATA_DIR}/${id}.json`, JSON.stringify(mockData, null, 2));

    // Return the generated URL
    res.json({ url: `http://localhost:${PORT}/mock/${id}` });
});

// API to return mock response
app.get("/mock/:id", (req, res) => {
    const filePath = `${DATA_DIR}/${req.params.id}.json`;

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "Mock response not found" });
    }

    // Read the stored response
    const mockData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    res.status(mockData.httpStatus)
        .set({
            "Content-Type": mockData.contentType + (mockData.charset ? `; charset=${mockData.charset}` : ""),
            ...mockData.headers
        })
        .send(mockData.responseBody);
});

app.get("/history", (req, res) => {
    const files = fs.readdirSync(DATA_DIR);
    const urls = files.map(file => ({
        id: file.replace(".json", ""),
        url: `http://localhost:${PORT}/mock/${file.replace(".json", "")}`
    }));

    res.json(urls);
});


app.delete("/delete/:id", (req, res) => {
    const filePath = `${DATA_DIR}/${req.params.id}.json`;

    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return res.json({ success: true, message: "Mock response deleted." });
    }

    res.status(404).json({ error: "Mock response not found." });
});

app.delete("/clear", (req, res) => {
    fs.readdirSync(DATA_DIR).forEach(file => fs.unlinkSync(`${DATA_DIR}/${file}`));
    res.json({ success: true, message: "All mock responses cleared." });
});



// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
