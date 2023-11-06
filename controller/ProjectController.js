const projects = require("../data");

function sendResponse(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

function getAllProjects(req, res) {
  sendResponse(res, 200, projects);
}

function getProject(req, res, id) {
  const project = projects.find((p) => p.id === id);
  if (project) {
    sendResponse(res, 200, project);
  } else {
    sendResponse(res, 404, { message: "No project found with given ID" });
  }
}

function getTopPerformProjects(req, res) {
  const topPerformProjects = projects
    .filter(project => project.revenue > 0)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 3);

  if (topPerformProjects.length > 0) {
    sendResponse(res, 200, topPerformProjects);
  } else {
    sendResponse(res, 404, { message: "No top-performing projects found" });
  }
}

module.exports = {
  getAllProjects,
  getProject,
  getTopPerformProjects,
};
