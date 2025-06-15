export const createRoom = (room: { id: number; name: string }) => {
  const roomExist = localStorage.getItem("room");
  if (roomExist) {
    return;
  }
  const roomData = {
    id: room.id,
    name: room.name,
  };
  localStorage.setItem("room", JSON.stringify(roomData));
};

export const checkRoom = (roomId: string) => {
  console.log("roomId", roomId);
  const roomExist = localStorage.getItem("room");
  console.log("roomExist", roomExist);
  if (!roomExist) {
    return false;
  }
  console.log("roomExist", roomExist);
  const roomData = JSON.parse(roomExist);
  console.log("roomData", roomData);
  console.log(typeof roomData.id, typeof roomId);
  return roomData.id === roomId;
};
