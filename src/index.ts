import { Container } from 'typescript-ioc';
import './infrastructure/config/ioc';
import { AppDataSource } from './infrastructure/database/data-source';
import app from './interfaces/server';
import { Database } from './infrastructure/database/database';

const PORT = process.env.PORT || 3000;

// AppDataSource.initialize()
//     .then(() => {
//         console.log("Banco de dados conectado!");
//         app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//     })
//     .catch((err) => console.error("Erro ao conectar no banco: ", err));

async function startServer() {
    try {
        const database = Container.get(Database);

        await database.connect();

        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (error) {
        console.error("Erro ao iniciar servidor:", error);
    }
}

startServer();