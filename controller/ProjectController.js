const projects = require("../data");

function sendResponse(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

function getAllProjects(req, res) {
  console.log("getting all projects");
  sendResponse(res, 200, projects);
}

function getTopPerformProjects(req, res) {
  console.log("getting top projects");
  const topPerformProjects = projects
    .filter((project) => project.revenue > 0)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 3);

  if (topPerformProjects.length > 0) {
    sendResponse(res, 200, topPerformProjects);
  } else {
    sendResponse(res, 404, { message: "No top-performing projects found" });
  }
}

function getCompletedProjects(req, res) {
  console.log("getting completed projects");
  const completedProjects = projects.filter((project) => project.isCompleted);

  if (completedProjects.length > 0) {
    sendResponse(res, 200, completedProjects);
  } else {
    sendResponse(res, 404, { message: "No completed projects found" });
  }
}

async function createProject(req, res) {
  try {
    const body = await getPostData(req); 

    const project = JSON.parse(body);

    console.log("Adding Project", project);

    projects.push(project);

    sendResponse(res, 200, JSON.stringify(project));
  } catch (error) {
    console.log(error);
  }
}

async function deleteProject(req, res) {
  try {
    const body = await getPostData(req);

    const parsedBodyObject = JSON.parse(body); // { id: 1 }

    console.log(parsedBodyObject);

    console.log(typeof parsedBodyObject.id);

    const index = projects.findIndex(
      (project) => project.id === parsedBodyObject.id
    );

    projects.splice(index, 1);

    sendResponse(
      res,
      200,
      JSON.stringify({ message: `Project ${parsedBodyObject.id} removed` })
    );
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  getAllProjects,
  getTopPerformProjects,
  getCompletedProjects,
  deleteProject,
  createProject,
};

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
