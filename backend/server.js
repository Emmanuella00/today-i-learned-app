const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.get("/api/wiki", async (req, res) => {
  const topic = req.query.topic;

  if (!topic) {
    return res.status(400).json({ error: "Missing topic parameter" });
  }

  try {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${topic}&format=json&origin=*`;
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    const searchResults = searchData.query.search;
    if (searchResults.length === 0) {
      return res.json({ title: "No facts found", extract: "", url: "#" });
    }

    const randomIndex = Math.floor(Math.random() * searchResults.length);
    const title = searchResults[randomIndex].title;

    const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
    const summaryResponse = await fetch(summaryUrl);
    const summaryData = await summaryResponse.json();

    res.json({
      title: summaryData.title,
      extract: summaryData.extract,
      url: summaryData.content_urls?.desktop?.page || "#",
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
