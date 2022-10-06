const path = require("path");
const express = require("express");
const socket = require("socket.io");
const http = require("http");

const app = express();
const server = http.createServer(app);
const io = socket(server);

app.use(express.static("static"));
app.set("port", process.env.PORT || 5000);
const PORT = app.get("port");

app.get("/district", (req, res) => {
  res.sendFile(path.join(__dirname, "/static/html/district.html"));
});
app.get("/epilog", (req, res) => {
  res.sendFile(path.join(__dirname, "/static/html/epilog.html"));
});
app.get("/keyword/:id", (req, res) => {
  res.sendFile(path.join(__dirname, `/static/html/keyword${req.params.id}.html`));
});
app.get("/kiosk", (req, res) => {
  res.sendFile(path.join(__dirname, "/static/html/kiosk.html"));
});
app.get("/wall", (req, res) => {
  res.sendFile(path.join(__dirname, "/static/html/wall.html"));
});
app.get("/media-table", (req, res) => {
  res.sendFile(path.join(__dirname, "/static/html/media-table.html"));
});
app.get("/media-table/old", (req, res) => {
  res.sendFile(path.join(__dirname, "/static/html/media-table-old.html"));
});
app.get("/media-table/now", (req, res) => {
  res.sendFile(path.join(__dirname, "/static/html/media-table-now.html"));
});
app.get("/month-record", (req, res) => {
  res.sendFile(path.join(__dirname, "/static/html/month-record.html"));
});
app.get("/panorama", (req, res) => {
  res.sendFile(path.join(__dirname, "/static/html/panorama.html"));
});

io.on("connection", function (socket) {
  /* 전송한 메시지 받기 */
  console.log("연결");
  socket.on("signal", function (data) {
    io.emit("update", data);
  });
  socket.on("media-table-signal", function (data) {
    io.emit("media-update", data);
  });

  socket.on("enter", function (data) {
    //console.log(data);
    io.emit("back", data);
  });
  /* 접속 종료 */
  socket.on("disconnect", function () {
    //console.log("user disconnect");
    io.emit("leave", { message: "end" });
  });
});

server.listen(PORT, () => {
  console.log(`${PORT}에서 서버대기중`);
});
