require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");

// Middlewares
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

// Routes
app.use("/user", require("./routes/userRouter"));
app.use("/api", require("./routes/categoryRouter"));
app.use("/api", require("./routes/upload"));
app.use("/api", require("./routes/productRouter"));

// Connect to MongoDB
const URI = process.env.MONGODB_URI;
mongoose
  .connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB ga ulanish xosil qilindi.");
  })
  .catch((err) => {
    console.log("Xato yuz berdi", err);
  });

app.get("/", (req, res) => {
  res.json({ msg: "Welcome to my MERN website" });
});

// Listen Port
const Port = process.env.PORT || 5000;
app.listen(Port, () => {
  console.log(`Server ${Port}-portda ishga tushdi...`);
});
