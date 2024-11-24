const {Server}=require ("socket.io")
const Sauth=require("../socket io/Sauth")

const io =new Server(8080,{cors:{origin:"*"}})
io.use(Sauth)
const clients=[]
io.on("connection",(socket)=>{
    const userId=socket.handshake.headers.userid
    clients.push({socketId:socket.id,userId:userId})
    console.log(clients)

socket.on("disconnect",()=>{
    for(let i=0;i<clients.length;i++){
        if(socket.id===clients[i].socketId){
             clients.splice(i,1)
        }
    }
    console.log(clients)
})

})