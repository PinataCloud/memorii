import type { NextApiRequest, NextApiResponse } from 'next'
import { getAuth } from '@clerk/nextjs/server'
import { pinata } from '@/pinata'

export const dynamic = 'force-dynamic' // Make sure you don't serve a cached key, which will be expired

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if(req.method === "GET") {
    try {
      const { userId} = getAuth(req)

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' })
      }
      
      const key = await pinata.keys.create({
        keyName: userId,
        permissions: {
          admin: true, // Safer to create a scoped token
        },
        maxUses: 1,
      });

      const foundGroup = await pinata.groups.list().name(userId)
      
      let groupId = null;

      if(!foundGroup.groups) {
        const group = await pinata.groups.create({
          name: userId,
          isPublic: false
        })

        groupId = group.id
      } else {
        groupId = foundGroup.groups[0].id;
      }

      
      res.status(200).json({ key: key.JWT, groupId })   
    } catch (error) {
      console.log(error);
      return res.status(500).send("Server error")
    }
  }  
}
