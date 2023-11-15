const projects = require("../data");
const { getPostData, validateProject } = require("../utlils");

function sendResponse(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

function getAllProjects(req, res) {
  if (!projects.length) {
    return sendResponse(res, 404, { message: "Projects not found!" });
  }
  sendResponse(res, 200, projects);
}

function getTop3ProjectsByRevenue(req, res) {
  const topPerformProjects = projects
    .filter((project) => project.revenue > 0)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 3);

  if (!topPerformProjects.length) {
    return sendResponse(res, 404, {
      message: "Top performed projects not found!",
    });
  }

  sendResponse(res, 200, topPerformProjects);
}

function getCompletedProjects(req, res) {
  const completedProjects = projects.filter((project) => project.isCompleted);

  if (!completedProjects)
    return sendResponse(res, 404, { message: "No completed projects" });

  sendResponse(res, 200, completedProjects);
}

async function createProject(req, res) {
  try {
    const body = await getPostData(req);
    const newProject = JSON.parse(body);

    const isValid = validateProject(newProject);
    if (!isValid)
      return sendResponse(res, 400, { message: "Invalid project!" });

    const project = projects.filter((p) => p.name === newProject.name);
    if (project.length)
      return sendResponse(res, 400, { message: "Project already exists!" });

    newProject.id = Math.max(...projects.map((p) => p.id), 0) + 1;
    projects.push(newProject);
    sendResponse(res, 200, newProject);
  } catch (ex) {
    const err = {
      message: "An error occurred while trying to add the new project",
    };
    sendResponse(res, 500, err);
  }
}

function deleteProject(req, res, pid) {
  try {
    const index = projects.findIndex((project) => project.id === pid);
    projects.splice(index, 1);

    if (index === -1) {
      const err = {
        message: "The project with the specified ID was not found",
      };
      return sendResponse(res, 404, err);
    } else {
      sendResponse(res, 200, {
        id: pid,
        message: "Project deleted successfully",
      });
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  getAllProjects,
  getTop3ProjectsByRevenue,
  getCompletedProjects,
  deleteProject,
  createProject,
};
