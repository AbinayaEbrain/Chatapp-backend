const Message = require('../models/messageModels');
const Conversation = require('../models/conversationModels');
const User = require('../models/userModels');
const helper = require('../Helpers/helpers');

module.exports = {
  async getAllMessages(req, res) {
    // Get the id's of sender and receiver
    const { sender_Id, receiver_Id } = req.params;
    // Inside conversation collection using findOne()
    const conversation = await Conversation.findOne({
      $or: [
        {
          $and: [
            {
              'participants.senderId': sender_Id,
              'participants.receiverId': receiver_Id
            }
          ]
        },
        {
          $and: [
            {
              'participants.senderId': receiver_Id,
              'participants.receiverId': sender_Id
            }
          ]
        }
      ]
    }).select('_id'); // 'select()' is used to get particular field from object

    if (conversation) {
      const messages = await Message.findOne({
        conversationId: conversation._id
      });
      res.status(200).json({ message: 'Messages returned', messages });
    } else {
      res.status(500).json({ message: 'Error' });
    }
  },

  sendMessage(req, res) {
    const { sender_Id, receiver_Id } = req.params;

    // To check in 'Conversation' model that senderId & receiverId is there...
    // If both id's are there,the users already started the conversation
    Conversation.find(
      {
        $or: [
          {
            participants: {
              $elemMatch: { senderId: sender_Id, receiverId: receiver_Id }
            }
          },
          {
            participants: {
              $elemMatch: { senderId: receiver_Id, receiverId: sender_Id }
            }
          }
        ]
      },
      // 'result' value is the value of participants array
      async (err, result) => {
        if (result.length > 0) {
          const msg = await Message.findOne({ conversationId: result[0]._id });
          helper.updateChatList(req, msg);

          await Message.update(
            {
              // To update conversationId in 'message' model
              conversationId: result[0]._id
            },
            {
              $push: {
                message: {
                  senderId: req.user._id,
                  receiverId: req.params.receiver_Id,
                  senderName: req.user.username,
                  receiverName: req.body.receiverName,
                  body: req.body.message
                }
              }
            }
          )
            .then(() => {
              res.status(200).json({ message: 'Message sent successfully' });
            })
            .catch(err => {
              res.status(500).json({ message: 'Error occured' });
            });
        } else {
          // To start a new conversation
          const newConversation = new Conversation();
          // Push into the participants array
          newConversation.participants.push({
            senderId: req.user._id,
            receiverId: req.params.receiver_Id
          });

          const saveConversation = await newConversation.save();

          // Update message model
          const newMessage = new Message();
          newMessage.conversationId = saveConversation._id;
          newMessage.sender = req.user.username;
          newMessage.receiver = req.body.receiverName;
          newMessage.message.push({
            senderId: req.user._id,
            receiverId: req.params.receiver_Id,
            senderName: req.user.username,
            receiverName: req.body.receiverName,
            body: req.body.message
          });

          // To update chatList array in sender's document
          await User.update(
            {
              // To find the document of sender
              _id: req.user._id
            },
            {
              $push: {
                chatList: {
                  // 'Position' operator is used to set value at the position in mongodb
                  // 'Position' operator always goes with 'each' operator
                  $each: [
                    {
                      receiverId: req.params.receiver_Id,
                      messageId: newMessage._id
                    }
                  ],
                  $position: 0
                }
              }
            }
          );

          // To update chatList array in receiver's document
          await User.update(
            {
              _id: req.params.receiver_Id
            },
            {
              $push: {
                chatList: {
                  $each: [
                    {
                      receiverId: req.params.sender_Id,
                      messageId: newMessage._id
                    }
                  ],
                  $position: 0
                }
              }
            }
          );

          await newMessage
            .save()
            .then(() => {
              res.status(200).json({ message: 'Message sent' });
            })
            .catch(err => {
              res.status(500).json({ message: 'Error occured' });
            });
        }
      }
    );
  },

  // To mark messages
  async markReceiverMessage(req, res) {
    // Using 'req.params', bcoz in 'messageRoutes' we are using 'get' method
    const { sender, receiver } = req.params;
    const msg = await Message.aggregate([
      { $unwind: '$message' }, // 'unwind' operator structures an 'message' array to display the values
      {
        // 'match' operator is used to match the value to the value which we are giving
        $match: {
          $and: [
            { 'message.senderName': receiver, 'message.receiverName': sender }
          ]
        }
      }
    ]);
    if (msg.length > 0) {
      try {
        // Bcoz 'msg' is an array ,we use foreach looping
        // Loop to every object in an array and check for _id matches.
        msg.forEach(async value => {
          await Message.update(
            {
              'message._id': value.message._id
            },
            { $set: { 'message.$.isRead': true } }
          );
        });
        res.status(200).json({ message: 'Marked as read' });
      } catch (err) {
        res.status(500).json({ message: 'Error occured' });
      }
    }
  },

   // To mark all messages
   async markAllMessages(req, res) {
    const msg = await Message.aggregate([
        {$match:{'message.receiverName':req.user.username}}, // If it matches,then unwind the array
        {$unwind:'$message'}, // It returns all object
        {$match:{'message.receiverName':req.user.username}}, // From that all objects, we are going to get the object which is equal to req.user.username
    ]);
    if (msg.length > 0) {
      try {
        msg.forEach(async value => {
          await Message.update(
            {
              'message._id': value.message._id
            },
            { $set: { 'message.$.isRead': true } }
          );
        });
        res.status(200).json({ message: 'Marked all messages as read' });
      } catch (err) {
        res.status(500).json({ message: 'Error occured' });
      }
    }
  }
};
