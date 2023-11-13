const projects = require("../data");

function sendResponse(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

function getAllProjects(req, res) {
  console.log("getting all projects");
  sendResponse(res, 200, projects);
}

function getTop3ProjectsByRevenue(req, res) {
  console.log("getting top projects");
  const topPerformProjects = projects
    .filter((project) => project.revenue > 0)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 3);

  sendResponse(res, 200, topPerformProjects);
}

function getTopProjectsCountByRevenue(req, res, count) {
  console.log("getting top projects");
  const topPerformProjects = projects
    .filter((project) => project.revenue > 0)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, count);

  sendResponse(res, 200, topPerformProjects);
}

function getCompletedProjects(req, res) {
  console.log("getting completed projects");
  const completedProjects = projects.filter((project) => project.isCompleted);

  sendResponse(res, 200, completedProjects);
}

async function createProject(req, res) {
  try {
    const body = await getPostData(req);

    const newProject = JSON.parse(body);

    if (projects.length == 0) {
      newProject.id = 1;
    } else {
      newProject.id = projects[projects.length - 1].id + 1;
    }

    console.log("Adding Project", newProject);

    projects.push(newProject);

    sendResponse(res, 200, JSON.stringify(newProject));
  } catch (error) {
    sendResponse(
      res,
      500,
      JSON.stringify({
        error: "Internal Server Error",
        message:
          "An error occurred while trying to add the new project to the database.",
      })
    );
  }
}

function deleteProject(req, res, pid) {
  try {
    console.log("Trying to delete project", pid);
    const index = projects.findIndex((project) => project.id === pid);

    console.log("Index", index);

    projects.splice(index, 1);

    if (index === -1) {
      sendResponse(
        res,
        404,
        JSON.stringify({
          error: "Not Found",
          message: "The project with the specified ID was not found",
        })
      );
      return;
    } else {
      sendResponse(res, 200, JSON.stringify({ message: pid }));
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  getAllProjects,
  getTop3ProjectsByRevenue,
  getTopProjectsCountByRevenue,
  getCompletedProjects,
  deleteProject,
  createProject,
};

// source : https://github.com/bradtraversy/vanilla-node-rest-api/blob/master/utils.js
function getPostData(req) {
  return new Promise((resolve, reject) => {
    try {
      let body = "";

      req.on("data", (chunk) => {
        body += chunk.toString();
      });

      req.on("end", () => {
        resolve(body);
      });
    } catch (error) {
      reject(error);
    }
  });
}
