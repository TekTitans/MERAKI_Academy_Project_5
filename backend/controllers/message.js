const message=(socket,io)=>{
    socket.on("message",(data)=>{
        console.log(data)
        data.sucsess=true
        socket.emit("message",data)
            })

}
module.exports={message}