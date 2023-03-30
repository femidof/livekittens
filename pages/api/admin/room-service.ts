import { RoomServiceClient, Room, ParticipantInfo } from 'livekit-server-sdk';
const svc = new RoomServiceClient(process.env.LIVEKIT_URL!, process.env.LIVEKIT_URL, process.env.LIVEKIT_URL);


// list rooms
svc.listRooms().then((rooms: Room[]) => {
    console.log('existing rooms', rooms);
  });

  
  // create a new room
const opts = {
    name: 'myroom',
    // timeout in seconds
    emptyTimeout: 10 * 60,
    maxParticipants: 20,
  };
  svc.createRoom(opts).then((room: Room) => {
    console.log('room created', room);
  });


  // delete a room
svc.deleteRoom('myroom').then(() => {
    console.log('room deleted');
  });


// getParticipants
svc.getParticipant("room","identity").then((participantInfo: ParticipantInfo) => {
    console.log('getParticipant', participantInfo);
});


// list participants
svc.listParticipants("room").then((participantsInfos: ParticipantInfo[])=> {
console.log('listParticipants', participantsInfos);
});