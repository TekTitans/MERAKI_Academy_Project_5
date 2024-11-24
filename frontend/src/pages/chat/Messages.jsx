import { useEffect,useState } from "react"


const Messages=({socket,userId,token})=>{
    const [message,setMessage]=useState("")
const [to,setTo]=useState("")
const [allMessages,setAllMessages]=useState([])


useEffect(()=>{
    socket.on("message",(data)=>{
        console.log(data)
        setAllMessages([...allMessages,data])
        return()=>{
            socket.off("message")
        }
    })

},[allMessages])
const sendMessage=()=>{
    socket.emit("message",{from:userId,to:to,message:message})
}
const renderMessages=allMessages?.map((elem,index)=>{
    return(
        <div key={index}>
            <h4>from:{elem.from}</h4>
            <p>
                {elem.message}
            </p>
        </div>
    )
})


    return(
        <div>
            <input onChange={(e)=>{setMessage(e.target.value)}} type="text" placeholder="message"></input>
            <input onChange={(e)=>{setTo(e.target.value)}} type="text" placeholder="to"></input>
            <button onClick={()=>{sendMessage()}}>send</button>

            <div>{renderMessages}</div>
        </div>
    )
}
export default Messages