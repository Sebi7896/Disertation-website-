const storage = multer.memoryStorage();
const authMiddleware = require('../../middleware/auth');
const upload = multer({ storage });

app.post('/upload', upload.single('pdf'),authMiddleware, (req, res) => {
  if (!req.file) {
    
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.status(200).json({ message: 'File uploaded successfully' });
});