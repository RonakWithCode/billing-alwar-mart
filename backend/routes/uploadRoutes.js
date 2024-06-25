const express = require('express');
const multer = require('multer');
const { bucket } = require('../config/firebase');
const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
});
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Create a reference to the file in Firebase Storage
    const blob = bucket.file(`products/${file.originalname}`);
    
    // Create a stream to upload the file
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    // Handle stream errors
    blobStream.on('error', (err) => {
      console.error(err);
      res.status(500).json({ message: 'Failed to upload file' });
    });

    // Handle stream finish
    blobStream.on('finish', async () => {
      try {
        await blob.makePublic();
        const fileUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        res.status(201).json({ url: fileUrl });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to make file public' });
      }
    });

    // End the stream and send the file buffer
    blobStream.end(file.buffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

