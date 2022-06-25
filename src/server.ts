import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { filterImageFromURL, deleteLocalFiles } from "./util/util";
import fs from "fs";
import path from "path";

(async () => {
  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get("/filteredimage", async (req: Request, res: Response) => {
    const { image_url } = req.query;
    if (!image_url) return res.status(400).send("Please provide an image url");

    const dirPath = path.join(__dirname, "util", "tmp");

    //  Create path if not exists
    fs.mkdirSync(dirPath, { recursive: true });

    // Read previous files before filtering
    const files = fs.readdirSync(dirPath);

    const filteredImageFile = await filterImageFromURL(image_url);

    await deleteLocalFiles(files);

    return res.sendFile(filteredImageFile);
  });

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (_: Request, res: Response) => {
    res.send("try GET /filteredimage?image_url={{}}");
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
