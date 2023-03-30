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

export default function listRooms(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { room } = req.body;
    const opts = {
      name: room,
      // timeout in seconds
      emptyTimeout: 10 * 60,
      maxParticipants: 20,
    };
    svc.createRoom(opts).then((room: Room) => {
      console.log("room created", room);
    });
    res.status(200);
  } else {
    res.status(200).json({ response: "Use POST" });
  }
}
