const http = require("http");
const ProjectController = require("./controller/ProjectController");
const { handleCors } = require("./utlils");
const port = 5001;
const baseUrl = "/api/projects";

const server = http.createServer((req, res) => {
  handleCors(req, res);

  // Handle preflight requests (OPTIONS method)
  if (req.method === "OPTIONS") {
    res.writeHead(200, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end();
    return;
  }

  if (req.url === baseUrl && req.method === "GET")
    ProjectController.getAllProjects(req, res);

  else if (req.url === `${baseUrl}/top` && req.method === "GET")
    ProjectController.getTop3ProjectsByRevenue(req, res);

  else if (req.url === `${baseUrl}/completed` && req.method === "GET") 
    ProjectController.getCompletedProjects(req, res);

  else if (req.url === baseUrl && req.method === "POST")
    ProjectController.createProject(req, res);

  else if ( req.url.startsWith(`${baseUrl}/`) && req.method === "DELETE") {
    // Extract project ID from the URL
    const projectId = parseInt(req.url.split("/").pop(), 10);
    ProjectController.deleteProject(req, res, projectId);
  } 
  else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "No Routes Found" }));
  }
});

server.listen(port, () => {
  console.info(`Server is Up and Running on ${port}`);
});
