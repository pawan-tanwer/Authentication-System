require("dotenv").config();
const express  = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const path = require("path")
const cors = require("cors"); 

app.use(cookieParser());
app.use(cors({
    origin: [
    "https://auth-frontend-r6jz.onrender.com", 
    "http://localhost:5173", 
  ],
    credentials: true,
    methods: [
        "GET",
        "POST",
        "PUT",
        "PATCH",
        "DELETE"
    ]
}));
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

//middleware for frontend
app.use(express.urlencoded({ extended :true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

//connection of mongodb
const connectDb = require("./config/db.js");
connectDb();

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Authentication API is running",
  });
});

app.get("/ping",(req,res)=>{
  res.status(200).send("pong,server is running");
})
// routes
const authRoute = require("./routes/auth.route.js");
const userRoute = require("./routes/user.route.js");
const errorMiddleware = require("./middleware/error.middleware.js");
app.use("/api/auth",authRoute);
app.use("/api/user",userRoute);

app.use(errorMiddleware)

app.listen(process.env.PORT||8000,()=>console.log("server is running on port 8000"));