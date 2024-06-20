import express, { Request, Response } from 'express';
import fs from 'fs';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;
const dbFilePath = "./db.json";

app.use(bodyParser.json());


app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

// Ping endpoint
app.get("/ping", (req: Request, res: Response) => {
  res.send(true);
});

// Submit endpoint
app.post("/submit", (req: Request, res: Response) => {
  const { name, email, phone, github_link, stopwatch_time } = req.body;
  const submission = { name, email, phone, github_link, stopwatch_time };

  fs.readFile(dbFilePath, (err, data) => {
    if (err) {
      return res.status(500).send("Error reading from database");
    }

    const submissions = JSON.parse(data.toString());
    submissions.push(submission);

    fs.writeFile(dbFilePath, JSON.stringify(submissions, null, 2), (err) => {
      if (err) {
        return res.status(500).send("Error writing to database");
      }
      res.send("Submission saved successfully");
    });
  });
});

// Read endpoint
app.get("/read", (req: Request, res: Response) => {
  const index = parseInt(req.query.index?.toString() ?? "0");

  fs.readFile(dbFilePath, (err, data) => {
    if (err) {
      return res.status(500).send("Error reading from database");
    }

    const submissions = JSON.parse(data.toString());
    if (index < 0 || index >= submissions.length) {
      return res.status(404).send("Submission not found");
    }

    res.send(submissions[index]);
  });
});



app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
