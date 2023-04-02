import { AccessToken } from "livekit-server-sdk";
import type { NextApiRequest, NextApiResponse } from "next";

// import Cors from 'cors'

type Data = {
  response: string;
};
type TokenResult = {
  room: String;
  identity: string;
  canPublish: boolean;
  accessToken: string;
};

export default function createToken(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      //    Publishing is true when user is sharing sharing video and audio also
      const { roomName, participantName, publishing = false } = req.body;
      console.log(roomName, participantName);

      const at = new AccessToken(
        process.env.LIVEKIT_API_KEY,
        process.env.LIVEKIT_API_SECRET,
        {
          identity: participantName,
          name: participantName,
        }
      );

      at.addGrant({
        roomJoin: true,
        room: roomName,
        canPublish: publishing,
        canSubscribe: true,
      });

      const token = at.toJwt();
      const result: TokenResult = {
        room: roomName,
        identity: participantName,
        canPublish: publishing,
        accessToken: token,
      };
      res.status(200).json(result);
    } catch (e) {
      res.statusMessage = (e as Error).message;
      res.status(500).end();
    }
  } else {
    res.status(200).json({ response: "Use POST" });
  }
}
