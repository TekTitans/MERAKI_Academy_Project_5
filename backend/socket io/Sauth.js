const Sauth=(socket,next)=>{
    const headers=socket.handshake.headers;
    if(!headers.token){
        next(new Error("invalid"))
    }else{
        socket.join("room-"/*+headers.userid*/)
        socket.user={token:headers.token,userid:headers.userid}
        next()
    }
}
module.exports=Sauth