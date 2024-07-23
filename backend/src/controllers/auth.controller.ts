import  { Request, Response} from 'express';
import prisma from '../db/prisma';
import bcryptjs from 'bcryptjs';
import generateToken  from '../utils/generateToken';


export const login  = async (req:Request,res:Response) => {
    try {
      const { username, password }  = req.body;
      const user = await prisma.user.findUnique({ where: { username } });
      
      if(!user) {
         return res.status(401).json({ error: 'Invalid credentials' });
      }
      const isPasswordCorrect  = await bcryptjs.compare(password, user?.password)
      
      if(!isPasswordCorrect) {
         return res.status(401).json({ error: 'Invalid credentials' });
      }
      generateToken(user.id, res)
      return res.status(200).json({
        id:user.id,
        fullName:user.fullName,
        username:user.username,
        profilePic:user.profilePic
      });
    } catch (error:any) {
        console.error(`Error in signup controller ${error.message}`);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export const logout = async (req:Request,res:Response) => {
    try{
        res.cookie("jwt", "", { maxAge:0});
        return res.status(200).json({ message: 'Logged out successfully' });
    } catch (error:any) {
        console.error(`Error in signup controller ${error.message}`);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export const signup = async (req:Request,res:Response) => {
    try {
        const { fullName, username, password, confirmPassword, gender }  = req.body;

        if(!fullName || ! username || !password || !confirmPassword || !gender) {
            return res.status(400).json({ error: 'Please fill in all fields' });
        }
        if(password !== confirmPassword) {
            return res.status(400).json({ error: 'Passwords do not match' });
        }

        const user  = await prisma.user.findUnique({ where:{username} });
        if(user) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // create
        const salt = await bcryptjs.genSaltSync(10);
        const hashedPassword = await bcryptjs.hash(password,salt);
        // https://avatar-placeholder.iran.liara.run/document
        const bodyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;
        
        const newUser = await prisma.user.create({
            data: {
                fullName,
                username,
                password: hashedPassword,
                gender,
                profilePic: gender === "male" ? bodyProfilePic : girlProfilePic
            }
        });
        if(newUser){
            // generate token in a sec
            generateToken(newUser.id, res)
            return res.status(201).json({ message: 'Register success', response:{
                id:newUser.id,
                fullName: newUser.fullName,
                username: newUser.username,
                profilePic: newUser.profilePic
            } });
        }else {
            return res.status(500).json({ error: 'Invalid user data' });
        }
     } catch (error:any) {
        console.error(`Error in signup controller ${error.message}`);
        return res.status(500).json({ error: 'Internal server error' });
      
     }
}

export const getMe  = async (req:Request, res:Response) => {
    try {
       const user = await prisma.user.findUnique({ where:{id:req.user.id} });
       if(!user) {
            return res.status(404).json({error: 'User not found'})
       }
       return res.status(200).json( {
         id: user.id,
         fullName: user.fullName,
         username: user.username,
         profilePic: user.profilePic
       })
       
    } catch (error:any) {
        console.error(`Error in signup controller ${error.message}`);
        return res.status(500).json({ error: 'Internal server error' });
    }
}