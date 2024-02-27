import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { sign } from "hono/jwt";

export const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    },
    variables:{
        userId : string
    }
}>();


// POST /api/v1/blog
  blogRouter.post('/',(c) =>{
    return c.text('hello blog')
  });
  
  // PUT /api/v1/blog
  blogRouter.put('/',(c) =>{
    return c.text('hello signup')
  });
  
  // GET /api/v1/blog
  blogRouter.get('/:id', (c) => {
    return c.text('Hello blog!')
  })
  