const message=(socket,io)=>{
    socket.on("message",(data)=>{
        console.log(data)
        data.sucsess=true
        socket.to("room-"/*+data.to*/).emit("message",data)
        socket.emit("message",data)
            })

}
module.exports={message}