import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToRecived, setAllMessages } from "../../components/redux/reducers/auth";
import "./chat.css";
import axios from "axios";

const Messages = ({ socket, userid }) => {
  const { token } = useSelector((state) => state.auth);
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const [message, setMessage] = useState("");
  const [messagess, setMessagess] = useState([]);
  const dispatch = useDispatch();
  const allMessages = useSelector((state) => state.auth.allMessages);
  const userName = useSelector((state) => state.auth.userName);
  const userId = useSelector((state) => state.auth.userId);
  const recived = useSelector((state) => state.auth.recived);

  const messagesEndRef = useRef(null);
  const chatBoxRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const createMessage = () => {
    axios
      .post(
        "http://localhost:5000/messages",
        { from: userName, from_id: userId, to: userid, message: message },
        { headers }
      )
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    axios
      .get(`http://localhost:5000/messages/${userid}`, { headers })
      .then((response) => {
        setMessagess(response.data);
      })
      .catch((err) => {
        console.log("Error fetching messages data:", err);
      });
  }, [userid, headers]);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("message", {
        from: userName,
        fromId: userId,
        to: userid,
        message,
      });
      setMessage("");
      createMessage();
    }
  };

  const renderMessages = messagess?.map((elem, index) => (
    <div className={elem.from_user === userName ? "me" : "notMe"} key={index}>
      <h4>{elem.from_user}</h4>
      <p>{elem.message}</p>
    </div>
  ));

  useEffect(() => {
    socket.on("message", (data) => {
      dispatch(setAllMessages([...allMessages, data]));
      if (data.fromId !== userId) {
        dispatch(addToRecived([...recived, data]));
      }
    });

    return () => {
      socket.off("message");
    };
  }, [dispatch, socket]);

  useEffect(() => {
    const chatBox = chatBoxRef.current;
    const isAtBottom =
      chatBox.scrollHeight - chatBox.scrollTop === chatBox.clientHeight;

    setIsAtBottom(isAtBottom);
  }, [messagess]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isAtBottom]);

  return (
    <div className="chatContainer">
      <div
        className="chatBox"
        ref={chatBoxRef}
        onScroll={() => {
          const chatBox = chatBoxRef.current;
          const isAtBottom =
            chatBox.scrollHeight - chatBox.scrollTop === chatBox.clientHeight;
          setIsAtBottom(isAtBottom);
        }}
      >
        {renderMessages}
        <div ref={messagesEndRef} />
      </div>

      <div className="textBox">
        <input
          onChange={(e) => setMessage(e.target.value)}
          type="text"
          placeholder="Message"
          value={message}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Messages;
