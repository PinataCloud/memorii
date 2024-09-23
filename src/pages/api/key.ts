import type { NextApiRequest, NextApiResponse } from 'next'
import { getAuth } from '@clerk/nextjs/server'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if(req.method === "GET") {
    try {
      const { getToken, userId} = getAuth(req)

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' })
      }
      const token = await getToken()
      //  Verify token here
      
      res.status(200).json({})   
    } catch (error) {
      console.log(error);
      return res.status(500).send("Server error")
    }
  }  
}
