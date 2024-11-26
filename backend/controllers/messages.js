
const pool = require("../models/db");
const createMessage = (req, res) => {
    const from = req.body.from;
    const to = req.body.to;
    const message = req.body.message;
    const from_id = req.body.from_id;


    const add = "INSERT INTO messages (from_user, to_user, message,from_id) VALUES ($1, $2, $3,$4)";
    
    pool.query(add, [from, to, message,from_id])
      .then((response) => {
        console.log(response);
        res.status(200).send('Message sent successfully');
      })
      .catch((error) => {
        console.log(error);
        res.status(500).send('Error sending message');
      });
};

  
 

    const getMessages = (req, res) => {
        const from = req.body.from;
        const to = req.body.to;
    
        const query = "SELECT sender_id, receiver_id, message_text, timestamp FROM messages WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1) ORDER BY timestamp ASC";
        
        pool.query(query, [from, to])
            .then((response) => {
                res.status(200).json(response.rows); 
            })
            .catch((error) => {
                console.log(error);
                res.status(500).send('Error retrieving messages');
            });
    };
    
   

  





module.exports = {getMessages,createMessage};
