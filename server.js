// /api/server.js
import express from 'express';
import serverless from 'serverless-http';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB Atlas
const uri = process.env.MONGO_URI;
mongoose
  .connect(uri)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Define a Payment Entry schema
const paymentEntrySchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  service: { type: String, required: true },
  payment: { type: Number, required: true },
  date: { type: Date, required: true },
});

const PaymentEntry = mongoose.model('PaymentEntry', paymentEntrySchema);

// GET all payment entries
app.get('/api/entries', async (req, res) => {
  try {
    const entries = await PaymentEntry.find().sort({ date: -1 });
    res.json(entries);
  } catch (error) {
    console.error("Error fetching entries:", error);
    res.status(500).json({ message: error.message });
  }
});

// POST a new payment entry
app.post('/api/entries', async (req, res) => {
  const { customerName, service, payment, date } = req.body;
  if (!customerName || !service || !payment || !date) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const newEntry = new PaymentEntry({
    customerName,
    service,
    payment,
    date,
  });

  try {
    const savedEntry = await newEntry.save();
    res.status(201).json(savedEntry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Export the Express app as a serverless function handler
export default serverless(app);
