import type { NextApiRequest, NextApiResponse } from "next";
import { RoomServiceClient, Room, ParticipantInfo } from "livekit-server-sdk";

const svc = new RoomServiceClient(
  process.env.LIVEKIT_URL!,
  process.env.LIVEKIT_API_KEY,
  process.env.LIVEKIT_API_SECRET
);

export default function getParticipant(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { room, identity } = req.body;
    svc
      .getParticipant(room, identity)
      .then((participantInfo: ParticipantInfo) => {
        console.log("getParticipant", participantInfo);
      });
    res.status(200);
  } else {
    res.status(200).json({ response: "Use POST" });
  }
}
