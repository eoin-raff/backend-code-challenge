import {Request, Response, NextFunction} from 'express'

// I will assume that IRL there would be more than one valid token, 
// and that they would be stored in a more secure manner
const validTokens = new Set<string>([
    'dGhlc2VjcmV0dG9rZW4'
])

export function authenticateToken(req:Request, res:Response, next:NextFunction){
    const authHeader = req.headers['authorization']
    if(!authHeader || !authHeader.toLowerCase().startsWith('bearer ')){
        res.status(401).send({message: "Unauthorized"})
        return
    }
    
    const token = authHeader.split(" ")[1]
    
    if(!validTokens.has(token)){
        res.status(401).send({message: "Unauthorized"})
        return
    }

    next()
}