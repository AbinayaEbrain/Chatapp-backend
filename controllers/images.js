const cloudinary = require('cloudinary');
const User = require('../models/userModels');

cloudinary.config({
  cloud_name: 'mobileapp',
  api_key: '478181889194855',
  api_secret: 'iDG3nImbWLuOGEUYSqePtKr1tO4'
});

module.exports = {
  uploadImage(req, res) {
    cloudinary.uploader.upload(req.body.image, async result => {
      await User.update(
        {
          _id: req.user._id
        },
        {
          $push: {
            images: {
              imgId: result.public_id,
              imgVersion: result.version
            }
          }
        }
      )
        .then(() => {
          res.status(200).json({ message: 'Image uploaded' });
        })
        .catch(err => {
          res.status(500).json({ message: 'Error uploading image' });
        });
    });
  }
};
