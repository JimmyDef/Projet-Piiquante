const http = require("http");
const app = require("./app");

//Renvoi un port valide, soit sous forme d'un numéro ou d'une chaine
const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

const errorHandler = (error) => {
  // si le server n'entend rien à l'appel
  if (error.syscall !== "listen") {
    // lance une erreur
    throw error;
  }
  const address = server.address();
  const bind =
    typeof address === "string" ? "pipe " + address : "port: " + port;
  switch (error.code) {
    case "EACCES":
      // EACCES est autorisation refusée
      console.error(bind + " requires elevated privileges.");
      process.exit(1);
      // process.exit(1) signifie mettre fin au processus avec un échec.
      break;
    case "EADDRINUSE":
      // EADDRINUSE veut dire que l'adresse cherchée est en cour d'utilisation
      console.error(bind + " is already in use.");
      process.exit(1);
      // process.exit(1) signifie mettre fin au processus avec un échec.
      break;
    default:
      throw error;
  }
};
//----------------------------------------
// SERVEUR
//----------------------------------------

// on passe cette application app en argument pour créer le serveur
const server = http.createServer(app);

server.on("error", errorHandler);
server.on("listening", () => {
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("Listening on " + bind);
});

// attend et ecoute les requetes envoyées
server.listen(port);
