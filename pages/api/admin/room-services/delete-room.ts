import type { NextApiRequest, NextApiResponse } from "next";
import { RoomServiceClient, Room, ParticipantInfo } from "livekit-server-sdk";

const svc = new RoomServiceClient(
  process.env.LIVEKIT_URL!,
  process.env.LIVEKIT_API_KEY,
  process.env.LIVEKIT_API_SECRET
);

type Data = {
  response: string;
};

export default function deleteRoom(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { room } = req.body;
    svc.deleteRoom(room).then(() => {
      console.log("room deleted");
    });
    res.status(200);
  } else {
    res.status(200).json({ response: "Use POST" });
  }
}
