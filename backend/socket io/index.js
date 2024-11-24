const {Server}=require ("socket.io")
const Sauth=require("../socket io/Sauth")
const {message}=require("../controllers/message")
const example=require("../socket io/example")

const io =new Server(8080,{cors:{origin:"*"}})
io.use(Sauth)
const clients=[]
io.on("connection",(socket)=>{
    socket.use(example)

    const userId=socket.handshake.headers.userid
    clients.push({socketId:socket.id,userId:userId})
    console.log(clients)
    message(socket,io)

socket.on("error",(error)=>{
    socket.emit("error",{error:error.message})
})
 

socket.on("disconnect",()=>{
    for(let i=0;i<clients.length;i++){
        if(socket.id===clients[i].socketId){
             clients.splice(i,1)
        }
    }
    console.log(clients)
})

})