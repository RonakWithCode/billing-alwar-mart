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

    const blob = bucket.file(`products/${file.originalname}`);
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    blobStream.on('error', (err) => {
      console.error(err);
      res.status(500).json({ message: 'Failed to upload file' });
    });

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

    blobStream.end(file.buffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
