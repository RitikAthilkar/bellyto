import { io, Socket } from "socket.io-client"

let socket: Socket

export const getSocket = () => {
//   console.log("socket base url", process.env.NEXT_SOCKET_URL)
  if (!socket) {
    socket = io("http://localhost:4000")
    
  }
  return socket
}
