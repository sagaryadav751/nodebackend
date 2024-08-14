let express = require('express')
let router = express.Router()
let user = require("../models/users")
const bcrypt = require('bcrypt')
const saltRounds = 10
const jwt = require('jsonwebtoken')
const jwtsecret= "99997777ggvv66n"


router.get("/user-details",async(req,res,next)=>{
   try{
        const data = await user.find({})
        res.status(201).send({
            success:true,
            message:"Data fetch Successculy",
            data,
        })
   }catch(error){
    console.log(error)
   }
})

router.post("/user-details", async(req,res,next)=>{

    try{
      const data = await new user({
        f_name:req.body.f_name,
        l_name:req.body.l_name,
        age:req.body.age,
        gender:req.body.gender,
        qli:req.body.qli,
        email:req.body.email,
        state:req.body.state,
        pass:req.body.pass,
        mob:req.body.mob

      }).save()
      res.status(201).send({
        success:true,
        message:"user added successfully",
        data,
      });
    }catch(error){
        console.log(error)
    }

})

router.delete("/user-details/:id",async(req,res,next)=>{

  try{
      const data = await user.findOneAndDelete({"_id":req.params.id})
     if(data)
     {
       return res.status(201).send({
        success:true,
        message:"data deleted succesfully",
      });
     }else{
      return res.status(201).send({
        success:false,
        message:"data not delted successfully"
      })
     } 
  }catch(error){
    console.log(error)
    return res.status(500).send(error)
  }
})

router.get("/user-details/:id",async(req,res,next)=>{
  try{
    const data = await user.findOne({"mob":req.params.id})
       if(data){
        return res.status(201).send({
          success:true,
          message:"record find successfully",
          data
       })
       }else{
        return  res.status(201).send({
          success:false,
          message:"mobile number not find"
        })
       }
  }catch(error){
    console.log(error)
    return res.status(501).send(error)
  }
})

router.put("/user-details",async(req,res,next)=>{
  
  try{
    const data = ({
      f_name:req.body.f_name,
      l_name:req.body.l_name,
      age:req.body.age,
      gender:req.body.gender,
      qli:req.body.qli,
      email:req.body.email,
      state:req.body.state,
      pass:req.body.pass,
      mob:req.body.mob

})
const response = await user.findOneAndUpdate({"mob":req.body.mob},data)
if(response){
  return res.send({
    success:true,
    message:"data updated successfully",
    response
  })
}
else{
  return res.send(
    {
      success:false,
      message:"data not updated"
    }
  )}
  }catch(error){
    console.log(error)
  }
})
router.post("/sign-up", async(req,res,next)=>{

  try{
    let c_pass= req.body.pass
    const hash = bcrypt.hashSync(c_pass,saltRounds)
      const data = await new user({
        f_name:req.body.f_name,
        l_name:req.body.l_name,
        email:req.body.email,
        mob:req.body.mob,
        pass:hash
      }).save()
      res.status(201).send({
        success:true,
        message:"sign up successfully",
        data
      })
  }catch(error){
    console.log(error)
  }
})

router.post("/login",async(req,res,next)=>{
  let password = req.body.pass
    let username = req.body.username
  try{
    const recieve = await user.findOne({email:username})
    if(recieve){
      if(bcrypt.compareSync(password,recieve.pass)){
        let payload = {uid:username}
        let token = jwt.sign(payload,jwtsecret,{expiresIn:360000})
        return res.status(201).send({
          success:true,
          message:"login successfully",
          token
        })
      }
    }else{
     
    }
    
  }catch(error){
    console.log(error)
  }
})

module.exports=router

