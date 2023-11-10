const http = require("http");
const ProjectController = require("./controller/ProjectController");

const port = 5001;

const server = http.createServer((req, res) => {
  // Set CORS headers to allow cross-origin requests
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight requests (OPTIONS method)
  if (req.method === "OPTIONS") {
    // Reply successfully to preflight request
    res.writeHead(200, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end();
    return;
  }

  if (req.url === "/api/v1/projects/all" && req.method === "GET") {
    ProjectController.getAllProjects(req, res);
  } else if (req.url === "/api/v1/projects/top" && req.method === "GET") {
    ProjectController.getTop3ProjectsByRevenue(req, res);
  } else if (req.url === "/api/v1/projects/completed" && req.method === "GET") {
    ProjectController.getCompletedProjects(req, res);
  } else if (req.url === "/api/v1/projects/save" && req.method === "POST") {
    ProjectController.createProject(req, res);
  } else if (
    req.url.startsWith("/api/v1/projects/delete/") &&
    req.method === "DELETE"
  ) {
    // Extract project ID from the URL
    const projectId = parseInt(req.url.split("/").pop(), 10);
    ProjectController.deleteProject(req, res, projectId);
  } else if (
    req.url.startsWith("/api/v1/projects/top/") &&
    req.method === "GET"
  ) {
    // Extract count from the URL
    const count = parseInt(req.url.split("/").pop(), 10);
    ProjectController.getTopProjectsCountByRevenue(req, res, count);
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "No Routes Found" }));
  }
});

server.listen(port, () => {
  console.info(`Server is Up and Running on ${port}`);
});
