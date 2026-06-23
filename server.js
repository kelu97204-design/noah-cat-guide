const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const dataDir = path.join(root, "data");
const feedbackFile = path.join(dataDir, "feedback.json");
const port = process.env.PORT || 5173;
const adminPassword = process.env.ADMIN_PASSWORD || "123456";

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml"
};

function ensureFeedbackFile() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(feedbackFile)) fs.writeFileSync(feedbackFile, "[]", "utf8");
}

function readFeedbacks() {
  ensureFeedbackFile();
  return JSON.parse(fs.readFileSync(feedbackFile, "utf8"));
}

function writeFeedbacks(feedbacks) {
  ensureFeedbackFile();
  fs.writeFileSync(feedbackFile, JSON.stringify(feedbacks, null, 2), "utf8");
}

function readRequestBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        request.destroy();
        reject(new Error("request too large"));
      }
    });
    request.on("end", () => resolve(body));
    request.on("error", reject);
  });
}

function sendJson(response, status, value) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(value));
}

function hasAdminAccess(request) {
  return request.headers["x-admin-password"] === adminPassword;
}

function sendFile(response, requestUrl) {
  const cleanUrl = decodeURIComponent(requestUrl.split("?")[0]);
  const relativePath = cleanUrl === "/" ? "/lukee-cat-guide.html" : cleanUrl;
  const filePath = path.normalize(path.join(root, relativePath));

  if (!filePath.startsWith(root)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }
    const type = mimeTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream";
    response.writeHead(200, { "Content-Type": type });
    response.end(content);
  });
}

const server = http.createServer(async (request, response) => {
  if (request.url === "/api/feedback" && request.method === "GET") {
    if (!hasAdminAccess(request)) {
      sendJson(response, 401, { error: "unauthorized" });
      return;
    }
    sendJson(response, 200, readFeedbacks());
    return;
  }

  if (request.url === "/api/feedback" && request.method === "POST") {
    try {
      const body = await readRequestBody(request);
      const input = JSON.parse(body);
      const feedback = {
        id: Date.now(),
        name: String(input.name || "匿名").slice(0, 30),
        contact: String(input.contact || "").slice(0, 80),
        type: String(input.type || "其他").slice(0, 20),
        message: String(input.message || "").slice(0, 500),
        page: String(input.page || "").slice(0, 300),
        createdAt: input.createdAt || new Date().toISOString()
      };
      if (!feedback.message.trim()) {
        sendJson(response, 400, { error: "message required" });
        return;
      }
      const feedbacks = readFeedbacks();
      feedbacks.unshift(feedback);
      writeFeedbacks(feedbacks);
      sendJson(response, 200, { ok: true });
    } catch {
      sendJson(response, 400, { error: "bad request" });
    }
    return;
  }

  sendFile(response, request.url);
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Noah cat guide is running at http://localhost:${port}`);
});

