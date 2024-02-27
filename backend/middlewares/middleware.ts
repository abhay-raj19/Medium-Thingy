import { jwt, verify } from "hono/jwt";

export function userMiddleware(app:any) {
    
    try {
        app.use('/api/v1/blog/*' ,async (c:any,next:any) =>{
            const jwttoken   = c.req.header("Authorization")?.split(" ")[1]

            if(!jwttoken){
                c.status(400)
                return c.json({
                    message:"Invalid Authorization token!"
                });
            }
            const {id} = await verify(jwttoken,c.env.JWT_SECRET)
            if(id){
                c.set('userId',id)
                await next()
            } else{
                c.status(403)
                return c.json({
                    message:"Unauthorised access!"
                })
            }

        })
    } catch (error) {
       console.log(error);        
    }
}