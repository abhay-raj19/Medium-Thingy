import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt'


const app = new Hono<{
	Bindings: {
		DATABASE_URL: string
    JWT_SECRET:string
	}
}>();


// POST /api/v1/signup
app.post('/api/v1/signup',async (c) =>{
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
    c.json({ 
      message: 'User not created!'
    })
    
  }
  
});

// POST /api/v1/signin
app.post('/api/v1/signin',(c) =>{
  return c.text('hello signin')
});

// POST /api/v1/blog
app.post('/api/v1/blog',(c) =>{
  return c.text('hello blog')
});

// PUT /api/v1/blog
app.put('/api/v1/blog',(c) =>{
  return c.text('hello signup')
});

// GET /api/v1/blog
app.get('/api/v1/blog/:id', (c) => {
  return c.text('Hello blog!')
})


export default app




