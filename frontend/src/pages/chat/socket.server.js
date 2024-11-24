import io from "socket.io-client"

const socketInit=({userId,token})=>{
   return io("http://localhost:8080/",{extraHeaders:{
    userid:userId,token:token
   },
 //  autoConnect:true//.connect()  .open()
}) 
}
export default socketInit