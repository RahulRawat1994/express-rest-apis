import UserModel from '../models/user.js'
import { 
  successWrapper,
  errorWrapper
} from '../utils.js';

export default {
  get: async (req, res) => {
    try {
      const users = await UserModel.find();
      res.send(successWrapper({result :users})).status(200);
    } catch (errors) {
      res.status(500).send(errorWrapper({errors}))
    }
  },
  view: async (req, res) => {
    try {
      const user = await UserModel.findById(req.params.id);
      res.send(successWrapper({result :user})).status(200);
    } catch (errors) {
      res.status(500).send(errorWrapper({errors}))
    }
  },
  create: async (req, res) => {
    try{
      
      const data = req.body;
      if(req.file){
        data.profile = req.file.path;
      }
      const user = await UserModel.create(data);
      res.send(successWrapper({result:user, status:201})).status(201);
    } catch (errors) {
      res.status(500).send(errorWrapper({errors}))
    }
      
  },
  update: async (req, res) => {
    try {
      const user = await UserModel.findByIdAndUpdate(req.params.id,
          req.body, {
              new: true
          },
      )
      res.send(successWrapper({result:user})).status(200);
    } catch (errors) {
      res.status(500).send(errorWrapper({errors}))
    }
  },
  delete: async (_req, res) => {
    try {
      const user = await UserModel.findById(id);
      if (user) {
          await user.remove();
          res.send(successWrapper({result:true})).status(200);
      }
      res.send(successWrapper({result:false})).status(200) 
    } catch (errors) {
      res.status(500).send(errorWrapper({errors}))
    }
  },
}
