import bcrypt from "bcryptjs";
import userModule from "../module/UserModels.js";
import validator from "email-validator";
import jwt from "jsonwebtoken";

class UserControllers {
  static getAllData = (req, res) => {
    res.send("welcome to our api");
  };
  static createData = async (req, res) => {
    try {
      const { name, email, password } = req.body;
      if (name && email && password) {
        const isValid = validator.validate(email);
        if (isValid) {
          const isUser = await userModule.findOne({ email: email });
          if (!isUser) {
            const hashPassword = await bcrypt.hash(req.body.password, 10);
            const doc = await userModule({
              name: name,
              email: email,
              password: hashPassword,
            });
            const result = await doc.save();
            if (result) {
              res
                .status(201)
                .json({ message: "User Register", user: result.name });
            } else {
              res.status(500).json({ message: "User not  Register" });
            }
          } else {
            res.status(200).json({ message: "User Already exist" });
          }
        } else {
          return res.status(400).json({ error: "Email is not valid" });
        }
      } else {
        res.status(200).json({ message: "All field is required" });
      }
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };
  static loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (email && password) {
        const isUser = await userModule.findOne({ email: email });
        if (isUser) {
          if (
            isUser.email === email &&
            (await bcrypt.compare(password, isUser.password))
          ) {
            const token = jwt.sign(
              { user: isUser._id },
              process.env.SECRET_KEY,
              {
                expiresIn: "2d",
              }
            );
            res
              .status(200)
              .json({ message: "login Sucessful",token:token,name: isUser.name });
          } else {
            res.status(422).json({ message: "Invalid Email Or Password" });
          }
        } else {
          res.status(422).json({ message: "Invalid Email Or Password" });
        }
      } else {
        res.status(422).json({ message: "All Field is required" });
      }
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };
  static changePassword = async (req, res) => {
    const { newpassword } = req.body;
    try {
      if (newpassword) {
        const newHashPassword = await bcrypt.hash(newpassword, 10);
        const result = await userModule.findByIdAndUpdate(req.user._id, {
          password: newHashPassword,
        });
        res.status(200).json({ message: "Update Password Sucessful" });
      } else {
        res.status(400).json({ message: "All Field is required" });
      }
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };
}

export default UserControllers;
