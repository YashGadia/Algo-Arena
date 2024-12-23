const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { createClient } = require("redis");
const { exec } = require("child_process");
const connectDB = require("./Config/Db");
const userRoutes = require("./Routes/UserRoutes");
const { notFound, errorHandler } = require("./Middlewares/ErrorMiddleWare");

const corsOptions = {
  origin: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: [
    "Access-Control-Allow-Origin",
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
  ],
  credentials: true,
};

const app = express();
dotenv.config();
app.use(cors(corsOptions));
connectDB();
app.use(express.json());

// app.use(notFound);
app.use(errorHandler);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

function scrapeLeetcodeUpcomingContests() {
  return new Promise((resolve, reject) => {
    exec(
      "python3 backend/Scrappers/LeetcodeDemo.py",
      (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing Leetcode.py: ${error}`);
          return reject(error);
        }
        if (stderr) {
          console.error(`stderr from Leetcode.py: ${stderr}`);
          return reject(stderr);
        }
        try {
          const contests = JSON.parse(stdout);
          resolve(contests);
        } catch (parseError) {
          console.error("Error parsing Leetcode.py output:", parseError);
          reject(parseError);
        }
      }
    );
  });
}

function scrapeCodechefUpcomingContests() {
  return new Promise((resolve, reject) => {
    exec(
      "python backend/Scrappers/CodechefDemo.py",
      {
        env: {
          ...process.env,
          VIRTUAL_ENV: "/path/to/venv",
          PATH: `/path/to/venv/bin:${process.env.PATH}`,
        },
      },
      (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing codechef.py: ${error}`);
          return reject(error);
        }
        if (stderr) {
          console.error(`stderr from codechef.py: ${stderr}`);
          return reject(stderr);
        }
        try {
          const contests = JSON.parse(stdout);
          resolve(contests);
        } catch (parseError) {
          console.error("Error parsing codechef.py output:", parseError);
          reject(parseError);
        }
      }
    );
  });
}

function scrapeGfgUpcomingContests() {
  return new Promise((resolve, reject) => {
    exec(
      "python backend/Scrappers/GfgDemo.py",
      {
        env: {
          ...process.env,
          VIRTUAL_ENV: "/path/to/venv",
          PATH: `/path/to/venv/bin:${process.env.PATH}`,
        },
      },
      (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing Gfg.py: ${error}`);
          return reject(error);
        }
        if (stderr) {
          console.error(`stderr from Gfg.py: ${stderr}`);
          return reject(stderr);
        }
        try {
          const contests = JSON.parse(stdout);
          resolve(contests);
        } catch (parseError) {
          console.error("Error parsing Gfg.py output:", parseError);
          reject(parseError);
        }
      }
    );
  });
}

function scrapeTopCoderUpcomingEvents() {
  return new Promise((resolve, reject) => {
    exec(
      "python3 backend/Scrappers/TopcoderDemo.py",
      (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing Topcoder.py: ${error}`);
          return reject(error);
        }
        if (stderr) {
          console.error(`stderr from Topcoder.py: ${stderr}`);
          return reject(stderr);
        }
        try {
          const contests = JSON.parse(stdout);
          resolve(contests);
        } catch (parseError) {
          console.error("Error parsing Topcoder.py output:", parseError);
          reject(parseError);
        }
      }
    );
  });
}

function scrapeHackerearthUpcomingContests() {
  return new Promise((resolve, reject) => {
    exec(
      "python backend/Scrappers/HackerearthDemo.py",
      {
        env: {
          ...process.env,
          VIRTUAL_ENV: "/path/to/venv",
          PATH: `/path/to/venv/bin:${process.env.PATH}`,
        },
      },
      (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing Hackerearth.py: ${error}`);
          return reject(error);
        }
        if (stderr) {
          console.error(`stderr from Hackerearth.py: ${stderr}`);
          return reject(stderr);
        }
        try {
          const contests = JSON.parse(stdout);
          resolve(contests);
        } catch (parseError) {
          console.error("Error parsing Hackerearth.py output:", parseError);
          reject(parseError);
        }
      }
    );
  });
}

function scrapeAtcoderUpcomingContests() {
  return new Promise((resolve, reject) => {
    exec(
      "python backend/Scrappers/AtcoderDemo.py",
      {
        env: {
          ...process.env,
          VIRTUAL_ENV: "/path/to/venv",
          PATH: `/path/to/venv/bin:${process.env.PATH}`,
        },
      },
      (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing atcoder.py: ${error}`);
          return reject(error);
        }
        if (stderr) {
          console.error(`stderr from atcoder.py: ${stderr}`);
          return reject(stderr);
        }
        try {
          const contests = JSON.parse(stdout);
          resolve(contests);
        } catch (parseError) {
          console.error("Error parsing atcoder.py output:", parseError);
          reject(parseError);
        }
      }
    );
  });
}

function fetchCodeforcesUpcomingContests() {
  return new Promise((resolve, reject) => {
    exec(
      "python backend/Scrappers/CodeforcesDemo.py",
      {
        env: {
          ...process.env,
          VIRTUAL_ENV: "/path/to/venv",
          PATH: `/path/to/venv/bin:${process.env.PATH}`,
        },
      },
      (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing Codeforces.py: ${error}`);
          return reject(error);
        }
        if (stderr) {
          console.error(`stderr from Codeforces.py: ${stderr}`);
          return reject(stderr);
        }
        try {
          const contests = JSON.parse(stdout);
          resolve(contests);
        } catch (parseError) {
          console.error("Error parsing Codeforces.py output:", parseError);
          reject(parseError);
        }
      }
    );
  });
}

// Route for '/'.
app.get("/", (req, res) => {
  res.send("Hello from Server");
});

app.use("/api/users", userRoutes); 

// Route for '/getUpcomingContestsData'.
app.get("/getUpcomingContestsData", async (req, res) => {
  const cachedKey = "upcomingContestsData";
  const cachedData = await client.get(cachedKey);

  if (cachedData) {
    console.log("Returning cached data");
    return res.json(JSON.parse(cachedData));
  }

  try {
    const leetcode = await scrapeLeetcodeUpcomingContests();
    const codechef = await scrapeCodechefUpcomingContests();
    const gfg = await scrapeGfgUpcomingContests();
    const topcoder = await scrapeTopCoderUpcomingEvents();
    const hackerearth = await scrapeHackerearthUpcomingContests();
    const atcoder = await scrapeAtcoderUpcomingContests();
    const codeforces = await fetchCodeforcesUpcomingContests();

    const upcomingContestsArray = [
      leetcode,
      codechef,
      gfg,
      topcoder,
      hackerearth,
      codeforces,
      atcoder,
    ];

    const allUpcomingContests = upcomingContestsArray.reduce(
      (acc, curr) => acc.concat(curr),
      []
    );

    allUpcomingContests.sort((a, b) => {
      const [dayA, monthA, yearA] = a.contestStartDate.split("-").map(Number);
      const [dayB, monthB, yearB] = b.contestStartDate.split("-").map(Number);

      // Convert contestStartDate strings to Date objects
      const dateA = new Date(yearA, monthA - 1, dayA);
      const dateB = new Date(yearB, monthB - 1, dayB);

      // Combine contestStartDate and contestStartTime for time comparison
      const timeA = new Date(`${dateA.toDateString()} ${a.contestStartTime}`);
      const timeB = new Date(`${dateB.toDateString()} ${b.contestStartTime}`);

      // Compare dates and times
      return timeA - timeB;
    });

    await client.set(cachedKey, JSON.stringify(allUpcomingContests));
    await client.expire(cachedKey, 24 * 60 * 60);
    console.log("Stored data in Redis");

    // console.log(allUpcomingContests);

    res.json(allUpcomingContests);
  } catch (error) {
    console.log("Error in fetching/updating contests: ", error);
    res.status(500).send("Internal Server Error");
  }
});

const PORT = process.env.PORT || 5000;

let client;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  client = createClient({
    password: "1oj0KStTRWkZeDDAXQmSHkvJBx9eQqNx",
    socket: {
      host: "redis-12867.c264.ap-south-1-1.ec2.redns.redis-cloud.com",
      port: 12867,
    },
  });
  client.connect().then(() => {
    console.log("Redis client is connected");
  });
});
