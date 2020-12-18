const User = require('../models/userModels');

module.exports = {
  firstUpper: username => {
    const name = username.toLowerCase();
    return name.charAt(0).toUpperCase() + name.slice(1);
  },

  lowerCase: str => {
    return str.toLowerCase();
  },

  // To update msg notification as ordered
  // Delete 'receiverId' from 'chatList' and Push 'receiverId' in 'chatList' in both sender and receiver document
  updateChatList: async (req, message) => {
    // To delete from sender document
    await User.update(
      {
        _id: req.user._id
      },
      {
        $pull: {
          chatList: {
            receiverId: req.params.receiver_Id
          }
        }
      }
    );

    // To delete from receiver document
    await User.update(
      {
        _id: req.params.receiver_Id
      },
      {
        $pull: {
          chatList: {
            receiverId: req.user._id
          }
        }
      }
    );

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
                messageId: message._id
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
                messageId: message._id
              }
            ],
            $position: 0
          }
        }
      }
    );
  }
};
