import jwt from "jsonwebtoken";
import userModule from "../module/UserModels.js";
const isuserAuthencated = async (req, res, next) => {
  let token;
  const authorization = String(req.headers["authorization"] || "");
  if ( authorization.startsWith("Bearer ")) {
    try {
      token =authorization.split(" ")[1];
      //Verify token
      const { user } =jwt.verify(token,"the secret key");
      
      //Get User from token
      req.user = await userModule.findById(user).select("--password");
      next();
    } catch (error) {
      res.status(401).json({ message: "unAuthorised User" });
    } 
  } else {
    res.status(401).json({ message: "unAuthorised User" });
  }
};

export default isuserAuthencated;
