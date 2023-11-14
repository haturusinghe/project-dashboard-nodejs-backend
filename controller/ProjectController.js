const projects = require("../data");
const { getPostData } = require("../utlils");

function sendResponse(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

function getAllProjects(req, res) {
  if (!projects.length) {
    return sendResponse(res, 404, { error: "Projects not found!" });
  }
  sendResponse(res, 200, projects);
}

function getTop3ProjectsByRevenue(req, res) {
  const topPerformProjects = projects
    .filter((project) => project.revenue > 0)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 3);

  if (!topPerformProjects.length) {
    return sendResponse(res, 404, { error: "Top performed projects not found!" });
  }

  sendResponse(res, 200, topPerformProjects);
}

function getCompletedProjects(req, res) {
  const completedProjects = projects.filter((project) => project.isCompleted);

  if (!completedProjects) 
    return sendResponse(res, 404, { error: "No completed projects" });

  sendResponse(res, 200, completedProjects);
}

async function createProject(req, res) {
  try {
    const body = await getPostData(req);
    const newProject = JSON.parse(body);

    const project = projects.filter(p => p.name === newProject.name);
    if (project.length) return sendResponse(res, 400, {error: "Project already exists!"});

    if (projects.length == 0) 
      newProject.id = 1;
    else 
      newProject.id = projects[projects.length - 1].id + 1;

    projects.push(newProject);
    sendResponse(res, 200, newProject);
  } 
  catch (ex) {
    const err = { 
      error: "Internal Server Error", 
      message: "An error occurred while trying to add the new project to the database."
    };
    sendResponse( res, 500, err);
  }
}

function deleteProject(req, res, pid) {
  try {
    const index = projects.findIndex((project) => project.id === pid);
    projects.splice(index, 1);

    if (index === -1) {
      const err = {
        error: "Not Found", 
        message: "The project with the specified ID was not found"
      }
      return sendResponse( res, 404, err);
    } 
    else {
      sendResponse(res, 200, { message: pid });
    }
  } 
  catch (error) {
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