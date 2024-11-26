import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAllMessages } from "../../components/redux/reducers/auth";
import "./chat.css";

const Messages = ({ socket }) => {
  const [message, setMessage] = useState("");
  const [to, setTo] = useState("");
  const dispatch = useDispatch();
  const allMessages = useSelector((state) => state.auth.allMessages);
  const userName = useSelector((state) => state.auth.userName);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on("message", (data) => {
      dispatch(setAllMessages([...allMessages, data]));
    });

    return () => {
      socket.off("message");
    };
  }, [allMessages, dispatch, socket]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [allMessages]);

  const sendMessage = () => {
    socket.emit("message", { from: userName, to, message });
    setMessage("");
  };

  const renderMessages = allMessages?.map((elem, index) => (
    <div className={elem.from === userName ? "me" : "notMe"} key={index}>
      <h4>{elem.from}</h4>
      <p>{elem.message}</p>
    </div>
  ));

  return (
    <div className="chatContainer">
      <div className="to">
        <input
          onChange={(e) => setTo(e.target.value)}
          type="text"
          placeholder="to"
        />
      </div>

      <div className="chatBox">
        {renderMessages}
        <div ref={messagesEndRef} />
      </div>

      <div className="textBox">
        <input
          onChange={(e) => setMessage(e.target.value)}
          type="text"
          placeholder="message"
          value={message}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Messages;
