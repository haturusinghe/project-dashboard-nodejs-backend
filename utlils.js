const handleCors = (req, res) => {
  // Set CORS headers to allow cross-origin requests
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

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

const validateProject = (project) => {
    if (!project.hasOwnProperty("name") || !project.hasOwnProperty("revenue") || !project.hasOwnProperty('isCompleted')) 
        return false;
    return true;
}

module.exports = { handleCors, getPostData, validateProject };