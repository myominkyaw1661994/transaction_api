const express = require("express");
const User  = require("../models/user");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const router = express.Router();
const Joi = require('joi');
const {generateAuthToken} = require("../models/user");

router.post("/", async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
  
    let user = await User.findOne({raw: true, where: {email : req.body.email}})
    if (!user) return res.status(400).send("Invalid Email or Password");
    console.log(user);

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send("Invalid Email or Password");
  
    const token = generateAuthToken(user);
    console.log(token);
    res.send(token);
});
  
function validate(req) {
    const schema = Joi.object({
        email: Joi.string().min(3).max(30).required().email(),
        password: Joi.string().min(3).max(255).required(),
    })
    
    return schema.validate(req);
}
  
module.exports = router
