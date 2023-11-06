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

async function createProject(req, res) {
  try {
    const body = await getPostData(req);

    const project = JSON.parse(body);

    console.log(project);

    projects.push(project);

    res.writeHead(201, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(project));
  } catch (error) {
    console.log(error);
  }
}

async function deleteProject(req, res) {
  try {
    const body = await getPostData(req);

    const b = JSON.parse(body);

    console.log(b);

    // console log the type of b.id
    console.log(typeof b.id);

    // find index of project with id b.id
    const index = projects.findIndex((project) => project.id === b.id);

    // pop the project out of the array at index
    projects.splice(index, 1);

    console.log(index);
    


    res.writeHead(200, { "Content-Type": "application/json" });

    return res.end(JSON.stringify({ message: `Project ${b.id} removed` }));



  } catch (error) {
    console.log(error);
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


module.exports = {
  getAllProjects,
  getTopPerformProjects,
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
