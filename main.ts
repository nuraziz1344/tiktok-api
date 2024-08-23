import express from "express";
import morgan from "morgan";
import tiktokDl from "./tiktokScraper";
const config = require("platformsh-config").config();

const app = express();
app.use(morgan("dev"));

app.get("/", (req, res) => {
    res.send("ok");
});

app.get("/tiktok", async (req, res) => {
    let url = req.query.url as string;
    if (!url) {
        return res.status(400).json({ error: "url query parameter is required" });
    } else if (!url.startsWith("http")) {
        url = "https://" + url;
    }
    return tiktokDl(url)
        .then((data) => {
            if ("error" in data) {
                return res.status(400).json(data);
            } else if ("video" in data) {
                res.set("Content-Type", "video/mp4");
                res.set("Content-Disposition", `attachment; filename="video.mp4"`);
                return res.send(data.video);
            } else {
                return res.json(data);
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: "server error" });
        });
});

app.listen(config.port, "0.0.0.0", () => {
    console.log(`Server running on port ${config.port}`);
});
