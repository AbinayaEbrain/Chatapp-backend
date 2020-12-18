const User = require('../models/userModels');

module.exports = {
  followUser(req, res) {
    //different way to use async and await
    const follow = async () => {
      //to update loggeduser data
      await User.update(
        {
          //mention the id to update
          //(in other words) = find the document of the user that want follow another user
          _id: req.user._id,
          //to block the user to follow the already following user
          'following.userFollowed': { $ne: req.body.userFollowed }
        },
        {
          $push: {
            following: {
              userFollowed: req.body.userFollowed
            }
          }
        }
      );

      //to update the user data who is followed by loggeduser
      await User.update(
        {
          _id: req.body.userFollowed,
          //to block the user who is already following
          'followers.follower': { $ne: req.user._id }
        },
        {
          $push: {
            followers: {
              follower: req.user._id
            },
            notifications: {
              senderId: req.user._id,
              message: `${req.user.username} is now following you.`,
              created: new Date()
            }
          }
        }
      );
    };
    follow()
      .then(() => {
        res.status(200).json({ message: 'Following user now' });
      })
      .catch(err => {
        res.status(500).json({ message: 'Error occured' });
      });
  },

  //Unfollow user
  unFollowUser(req, res) {
    const unfollow = async () => {
      await User.update(
        {
          _id: req.user._id
        },
        {
          //'pull' is used to pull out from that array
          $pull: {
            following: {
              userFollowed: req.body.userFollowed
            }
          }
        }
      );

      await User.update(
        {
          _id: req.body.userFollowed
        },
        {
          $pull: {
            followers: {
              follower: req.user._id
            }
          }
        }
      );
    };
    unfollow()
      .then(() => {
        res.status(200).json({ message: 'Unfollowing user' });
      })
      .catch(err => {
        res.status(500).json({ message: 'Error occured' });
      });
  },

  async markNotifications(req, res) {
    //in user.service.ts,markNotification() method doesn't contain the value for deleteVal,we are going to mark the notification as read
    if (!req.body.deleteVal) {
      //updateOne() to update single file
      await User.updateOne(
        {
          //find the document
          _id: req.user._id,
          //get the notification array for the above id
          'notifications._id': req.params.id
        },
        {
          //set() used to set the value of particular array
          //$ is used to set the value
          $set: { 'notifications.$.read': true }
        }
      )
        .then(() => {
          res.status(200).json({ message: 'Marked as read' });
        })
        .catch(err => {
          res.status(500).json({ message: 'Error occured' });
        });
    } else {
      //to delete notification
      await User.update(
        {
          _id: req.user._id,
          'notifications._id': req.params.id
        },
        {
          $pull: {
            notifications: { _id: req.params.id }
          }
        }
      )
        .then(() => {
          res.status(200).json({ message: 'Deleted successfully' });
        })
        .catch(err => {
          res.status(500).json({ message: 'Error occured' });
        });
    }
  },

  //mark all notifications
  async markAllNotifications(req, res) {
    await User.update(
      {
        _id: req.user._id
      },
      {
        //'arrayFilters' is used to filter the array and look for 'read' which is set to false
        //'set' is used to set the value to true
        //$[elem] is used to set the value for whole object
        $set: { 'notifications.$[elem].read': true }
      },
      { arrayFilters: [{ 'elem.read': false }], multi: true }
    )
      .then(() => {
        res.status(200).json({ message: 'Marked all successfully' });
      })
      .catch(err => {
        res.status(500).json({ message: 'Error occured' });
      });
  }
};
