import * as dotenv from 'dotenv';
dotenv.config(); // carga el archivo .env

export const jwtConstants = {
    secret: process.env.JWT_SECRET || 'CLAVE_SECRETA_TEMPORAL_CAMBIA_ESTA_EN_PRODUCCION',
};