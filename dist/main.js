"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const tiktokScraper_1 = __importDefault(require("./tiktokScraper"));
const app = (0, express_1.default)();
app.use((0, morgan_1.default)("dev"));
const PORT = parseInt(process.env.PORT || "3000");
app.get("/", (req, res) => {
    res.send("ok");
});
app.get("/tiktok", async (req, res) => {
    let url = req.query.url;
    if (!url) {
        return res.status(400).json({ error: "url query parameter is required" });
    }
    else if (!url.startsWith("http")) {
        url = "https://" + url;
    }
    return (0, tiktokScraper_1.default)(url)
        .then((data) => {
        if ("error" in data) {
            return res.status(400).json(data);
        }
        else if ("video" in data) {
            res.set("Content-Type", "video/mp4");
            res.set("Content-Disposition", `attachment; filename="video.mp4"`);
            return res.send(data.video);
        }
        else {
            return res.json(data);
        }
    })
        .catch((err) => {
        console.error(err);
        res.status(500).json({ error: "server error" });
    });
});
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
