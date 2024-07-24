import express from 'express';
import cookieParser  from 'cookie-parser'
import authRoutes from './routes/auth.route';
import messageRoutes from './routes/message.route';

import dotenv  from 'dotenv';
dotenv.config();

const app = express();
const port =  process.env.PORT! || 4000;

//disable x-power 
app.disable('x-powered-by');

app.use(express.json());  // for parsing application/json
app.use(express.urlencoded({ extended:true , limit: "50MB"})); 
app.use(cookieParser()) // for parsing cookies

app.get('/',(req:express.Request,res:express.Response) => {
    return res.status(200).json({
        message: 'Welcome to the PERN Chat App'
    })
})
app.use('/api/auth', authRoutes)
app.use('/api/messages', messageRoutes)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


// Todo: Add socket.io to the server
// Todo: Configure this serveer for the deployment