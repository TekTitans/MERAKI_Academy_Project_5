const Sauth=(socket,next)=>{
    const headers=socket.handshake.headers;
    if(!headers.token){
        next(new Error("invalid"))
    }else{
        socket.user={token:headers.token,user_id:headers.userid}
        next()
    }
}
module.exports=Sauth