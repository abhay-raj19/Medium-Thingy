import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt'

 export const userRouter = new Hono<{
	Bindings: {
		DATABASE_URL: string
        JWT_SECRET:string
	},
    Variables:{
        userId: string
  }
}>();


// ✅POST /api/v1/signup
userRouter.post('/signup',async (c) =>{
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
}).$extends(withAccelerate())

  try {
    const body = await c.req.json();

    //check if user exist prior to signup.
    const prioUser = await prisma.user.findUnique({
      where:{
        email:body.email,
      },
    });
    if(prioUser){
      c.status(400);
      return c.json({
        message:"User exist! Do login"
      })
    }
    //created up the user by payloads
    const user = await prisma.user.create({
      data:{
        name:body.name,
        email:body.email,
        password:body.password,
      },
    })
    //Generating up the Tokens 
     const token =await sign({id:user.id},c.env.JWT_SECRET)
     return c.json({
        message:"User Created Succesfully!",
        jwt : token,
     });

  } catch (error) {
    console.log(error);
    c.status(403);
    c.json({ 
      message: 'User not created!'
    })
    
  }  
});

// ✅POST /api/v1/signin
userRouter.post('/signin',async (c) => {

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  
  try {
    const jwttoken   = c.req.header("Authorization")?.split(" ")[1]

    if (!jwttoken) {
      c.status(400); // or any other appropriate status code
      return c.json({
        msg: "Invalid Authorization header",
      });
    }

    const {id} = await verify(jwttoken , c.env.JWT_SECRET)
    // console.log(id);
    const user = await prisma.user.findUnique({
      where:{
        id:id,
      },
    })
    if(!user){
      c.status(403);
      return c.json({
        msg:"User not Found! try Signup"
      })
    }
    return c.json({
      msg:"User Succesfully SignIn"
    })   
    
  } catch (error) {
    console.log(error);
    // Handle other errors or return an appropriate response
    c.status(500);
    return c.json({
      msg: "Internal Server Error",
    });
    
  }
 
});