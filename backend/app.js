import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import collaborationRoutes from "./routes/collaborationRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import handleError from "./middleware/errorMiddleware.js";
import userRoutes from "./routes/userRoutes.js";


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/",(_, res)=>{
    res.send("hellow moto....");
})
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/collaborators", collaborationRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/users", userRoutes);

app.use(handleError);



export default app;