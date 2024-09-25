import type { NextApiRequest, NextApiResponse } from 'next'
import { getAuth, auth } from '@clerk/nextjs/server'
import { pinata } from '@/pinata'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if(req.method === "GET") {
    try {
      auth().protect()
      const { userId} = getAuth(req)

      const id = req.query.id;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' })
      }
      
      const groups = await pinata.groups.list().name(userId)
      
      let files = []

      if(groups && groups?.groups?.length > 0) {
        const group = groups.groups[0];
        const response = await pinata.files.list().group(group.id).cid(id as string)
        if(response && response.files) {
          const signedUrl = await pinata.gateways.createSignedURL({ cid: id as string, expires: 30000 })
          return res.status(200).send(signedUrl)   
        } else {
          return res.status(400).send("File not found")
        }        
      }          
    } catch (error) {
      console.log(error);
      return res.status(500).send("Server error")
    }
  }  
}