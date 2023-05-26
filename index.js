import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const server = express();
server.use(express.json())
server.use(express.urlencoded())
server.use(cors())

mongoose.connect("mongodb://localhost:27017/registrationDB")
  .then(() => {
    console.log('database connected')

  }).catch(() => {
    console.log('error');
  })

// CREATE USER'S SCHEMA
const student = new mongoose.Schema({

  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  company: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String
  },
  linkedInProfile: {
    type: String
  },
  areasOfExpertise: {
    type: [String],
    required: true
  },
  experience: {
    type: Number,
    required: true
  },
  availability: {
    type: String
  },
  resumeURL: {
    type: String
  }
});

// CRAETE A MODEL
const User = new mongoose.model("User", student)


// Route

server.post("/register",(req, res) => {
  // console.log(req.body);
  const { email} = req.body;
  User.findOne({ email: email },  async (err, user) => {
    if (user) {
      res.send({ message: "user already exist" })
    } else {
      const user = new User(req.body)
      console.log(user)
      await user.save(err => {
        if (err) {
          res.send(err)
        } else {
          res.send("save data")
          
        }
      })

    }
  })
})

server.get("/getRegisteredUser", async(req, res)=>{

try{
const allUser = await User.find({});
// console.log(allUser);
res.send(allUser);
}
catch(error){
console.log(error)
}
})

// DELETE API 

server.get("/deleteUser/:id", async(req, res)=>{
  try{
    const id = req.params.id
    // console.log(id);
    await User.deleteOne({_id: id})

    res.send({success: true, msg: 'deleted'})
  }
  catch(error){
    res.send({success: false, msg: error})
  }
})


// Define the GET endpoint
server.get('/getuserby/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).send('Invalid user ID');
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }

    res.json(user);
  } catch (error) {
    console.error('Error finding user:', error);
    res.status(500).send('Error finding user');
  }
});

server.put('/updateuser/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).send('Invalid user ID');
    }
    const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });
    if (!updatedUser) {
      return res.status(404).send('User not found');
    }

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).send('Error updating user');
  }
});

 
server.listen(5000, () => {
  console.log("server is working")
})