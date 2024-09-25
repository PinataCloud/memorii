import type { NextApiRequest, NextApiResponse } from 'next'
import { getAuth, auth } from '@clerk/nextjs/server'
import { pinata } from '@/pinata'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if(req.method === "GET") {
    try {
      auth().protect()
      const { userId} = getAuth(req)      
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' })
      }
      
      const groups = await pinata.groups.list().name(userId)
      
      let files = []

      if(groups && groups?.groups?.length > 0) {
        const group = groups.groups[0];
        const response = await pinata.files.list().group(group.id)
        for(const file of response.files) {        
          const signedUrl = await pinata.gateways.createSignedURL({ cid: file.cid, expires: 30000 }).optimizeImage({
            width: 500,
            height: 500,
            format: "webp"
          })
          
          files.push({
            id: file.id, 
            name: file.name, 
            size: file.size, 
            source: signedUrl, 
            cid: file.cid
          })
        }
      }
      

      res.status(200).json(files)   
    } catch (error) {
      console.log(error);
      return res.status(500).send("Server error")
    }
  }  
}