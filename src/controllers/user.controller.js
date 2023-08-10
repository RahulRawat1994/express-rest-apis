import UserModel from "../models/user.model.js";
export default {
  get: async (req, res) => {
    const users = await UserModel.find();
    return res.json({ data: users })
  },
  view: async (req, res) => {
    const user = await UserModel.findById(req.params.id);
    return res.json({ data: user })
  },
  create: async (req, res) => {
    const data = req.body;
    if (req.file) {
      data.profile = req.file.path;
    }
    const user = await UserModel.create(data);
    return res.json({ data: user, status: 201 }).status(201);
  },
  update: async (req, res) => {
    const user = await UserModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.json({ data: user })
  },
  delete: async (_req, res) => {
    const user = await UserModel.findById(id);
    if (user) {
      await user.remove();
      res.send({ data: true })
    }
    return res.json({ data: false })
  },
};
