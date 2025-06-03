import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './src/routes/user.route.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5500;

app.use(cors({
  origin: ['https://kumiho-esports.onrender.com', 'https://kumiho.onrender.com', 'https://kumihoesports.com', 'kumihoesports.com', 'http://localhost:5173', 'https://www.kumihoesports.com'],
  credentials: true
}));
app.use(express.json());

app.get('/', (req, res) => res.send('API Kumiho operativa'));

// Routes
app.use("/users", userRoutes);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
})