const http = require("http");
const port = 5001;
const ProjectController = require("./controller/ProjectController");

const server = http.createServer((req, res) => {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Define API routes and methods
  const routes = {
    '/api/v1/projects': {
      'GET': ProjectController.getAllProjects,
    },
    '/api/v1/projects/getTopProject': {
      'GET': ProjectController.getTopPerformProjects,
    },
    '/api/v1/projects/': {
      'GET': ProjectController.getProject,
    }
  };

  // Extract route and method from request
  const route = routes[req.url] && routes[req.url][req.method];

  // Handle the request based on the defined routes and methods
  if (route) {
    route(req, res);
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'No Routes Found' }));
  }
});

server.listen(port, () => {
  console.info(`Server is Up and Running on ${port}`);
});
