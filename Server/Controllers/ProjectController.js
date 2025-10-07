import Idea from "../Models/Idea.js";
//  working
export const createProject = async (req, res) => {
  const { title, description } = req.body;
  try {
    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and Description are required" });
    }
    const newProject = new Idea({
      title,
      description,
      createdBy: req.user._id,
    });
    await newProject.save();
    res
      .status(201)
      .json({ message: "Project created successfully", project: newProject });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};


export const editProject = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  try {
    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and Description are required" });
    }
    const project = await Idea.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to edit this project" });
    }
    project.title = title;
    project.description = description;
    await project.save();
    res
      .status(200)
      .json({ message: "Project updated successfully", project: project });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

export const getUserProjects = async (req, res) => {
  try {
    const projects = await Idea.find({ createdBy: req.user._id });
    const count = await Idea.countDocuments({ createdBy: req.user._id });
    if (count === 0) {
      return res.status(404).json({ message: "No projects found for this user" });
    }
    res.status(200).json({ projects: projects, count: count });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

export const getAllProjects = async (req, res) => {
  try {
    const projects = await Idea.find().populate("createdBy", "username email registerno");
    
    // Group projects by registration number
    const groupedProjects = projects.reduce((acc, project) => {
      const registerno = project.createdBy.registerno;
      if (!acc[registerno]) {
        acc[registerno] = {
          projects: []
        };
      }
      acc[registerno].projects.push(project);
      return acc;
    }, {});

    res.status(200).json(groupedProjects);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

export const getProjectById = async (req, res) => {
  const { id } = req.params;
  try {
    const project = await Idea.findById(id).populate(
      "createdBy",
      "username email"
    );
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json({ project: project });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

export const deleteProject = async (req, res) => {
  const { id } = req.params;
  try {
    const project = await Idea.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this project" });
    }
    await project.remove();
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

export const UpdateStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const project = await Idea.findById(id);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        project.status = status;
        await project.save();
        res.status(200).json({ message: "Project status updated successfully", project: project });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error", error: error });
    }
}