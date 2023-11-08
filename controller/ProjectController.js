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
    sendResponse(res, 404, []);
  }
}

function getCompletedProjects(req, res) {
  console.log("getting completed projects");
  const completedProjects = projects.filter((project) => project.isCompleted);

  if (completedProjects.length > 0) {
    sendResponse(res, 200, completedProjects);
  } else {
    sendResponse(res, 404, { message: 404 });
  }
}

async function createProject(req, res) {
  try {
    const body = await getPostData(req);

    const newProject = JSON.parse(body);

    if(newProject.id == -1){
      console.log("Updainting ID");
      projects.sort((a, b) => b.id - a.id);
      const newId = projects[0].id + 1;
      newProject.id = newId;

      projects.sort((a, b) => a.id - b.id);
    }

    console.log("Adding Project", newProject);

    projects.push(newProject);

    sendResponse(res, 200, JSON.stringify(newProject));
  } catch (error) {
    console.log(error);
  }
}

function deleteProject(req, res, pid) {
  try {
    console.log("Trying to delete project", pid);
    const index = projects.findIndex((project) => project.id === pid);

    console.log("Index", index);

    projects.splice(index, 1);

    if (index === -1) {
      sendResponse(res, 404, JSON.stringify({ message: "Project Not Found" }));
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
  getTopPerformProjects,
  getCompletedProjects,
  deleteProject,
  createProject
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
