import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5500;

app.use(cors({
  origin: ['https://kumiho.onrender.com', 'https://kumihoesports.com'],
  credentials: true
}));
app.use(express.json());

app.get('/', (req, res) => res.send('API Kumiho operativa'));

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
})