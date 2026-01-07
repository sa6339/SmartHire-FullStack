const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/smarthire")
  .then(()=>console.log("MongoDB connected"));

const User = mongoose.model("User", new mongoose.Schema({
  name:String,
  email:String,
  password:String
}));

app.post("/register", async (req,res)=>{
  const hash = await bcrypt.hash(req.body.password,10);
  await new User({...req.body,password:hash}).save();
  res.send("Registered");
});

app.post("/login", async (req,res)=>{
  const user = await User.findOne({email:req.body.email});
  if(!user) return res.send("User not found");
  const ok = await bcrypt.compare(req.body.password,user.password);
  if(!ok) return res.send("Wrong password");
  res.json({token: jwt.sign({id:user._id},"secret")});
});

app.listen(5000,()=>console.log("Server started"));

