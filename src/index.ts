import './infrastructure/config/ioc';
import { AppDataSource } from './infrastructure/database/data-source';
import app from './interfaces/server';

const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
    .then(() => {
        console.log("Banco de dados conectado!");
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((err) => console.error("Erro ao conectar no banco: ", err));