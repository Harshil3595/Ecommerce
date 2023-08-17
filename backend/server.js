const app = require('./app');
const dotenv = require('dotenv');
const connectDatabase = require('./config/db');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Handling uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log(`Error: ${err.message}`);
  console.log('Shutting down the server due to an uncaught error');
  server.close(() => {
    process.exit(1);
  });
});

// Configuration
dotenv.config({ path: 'backend/config/config.env' });

// Connect to the database
connectDatabase();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'avatars', // Optional folder name in Cloudinary
    format: async (req, file) => 'png', // Optional file format
    public_id: (req, file) => `${Date.now()}-${file.originalname}`, // Optional public ID generation
  },
});

const upload = multer({ storage: storage });

const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

// Unhandled Promise Rejection
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  console.log('Shutting down the server due to an unhandled promise rejection');
  server.close(() => {
    process.exit(1);
  });
});
