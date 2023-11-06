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

  // Define API routes and methods
  const routes = {
    "/api/v1/projects/all": {
      GET: ProjectController.getAllProjects,
    },
    "/api/v1/projects/top": {
      GET: ProjectController.getTopPerformProjects,
    },
    "/api/v1/projects/completed": {
      GET: ProjectController.getCompletedProjects,
    },
    "/api/v1/projects/save": {
      POST: ProjectController.createProject,
    },
    "/api/v1/projects/delete": {
      POST: ProjectController.deleteProject,
    },
  };

  // Extract route and method from request
  const route = routes[req.url] && routes[req.url][req.method];

  // Handle the request based on the defined routes and methods
  if (route) {
    route(req, res);
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "No Routes Found" }));
  }
});

server.listen(port, () => {
  console.info(`Server is Up and Running on ${port}`);
});
