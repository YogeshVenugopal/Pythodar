import express from "express";
import { protect, staffOnly } from "../Middlewares/AuthMiddleware.js";
import {
  createProject,
  deleteProject,
  editProject,
  getAllProjects,
  getProjectById,
  getUserProjects,
  UpdateStatus,
} from "../Controllers/ProjectController.js";

const ProjectRoute = express.Router();

ProjectRoute.post("/create", protect, createProject);
ProjectRoute.put("/edit/:id", protect, editProject);
ProjectRoute.get("/my-projects", protect, getUserProjects);
ProjectRoute.get("/all-projects", getAllProjects);
ProjectRoute.get("/project/:id", protect, getProjectById);
ProjectRoute.delete("/delete/:id", protect, deleteProject);

ProjectRoute.put("/edit-status/:id", protect, staffOnly, UpdateStatus);

export default ProjectRoute;