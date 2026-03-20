import { Container } from 'typescript-ioc';
import './infrastructure/config/ioc';
import app from './interfaces/server';
import { Database } from './infrastructure/database/database';
import { logger } from './infrastructure/config/logger';

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        const database = Container.get(Database);

        await database.connect();

        logger.info('application starting');
        logger.info({ port: 3000 }, 'server listening');

        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (error) {
        console.error("Erro ao iniciar servidor:", error);
    }
}

startServer();