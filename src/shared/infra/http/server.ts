import 'reflect-metadata';

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import 'express-async-errors';

import routes from './routes';

import '@shared/infra/typeorm';
import '@shared/container';

import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError'
import { useContainer } from 'typeorm';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.directory));
app.use(routes);

app.use((error: Error, request: Request, response: Response, _: NextFunction) => {
    if (error instanceof AppError) {
            return response.status(error.statusCode).json({
                status: 'error',
                message: error.message
            })
    }

    return response.status(500).json({
        status: 'error',
        // message: 'Internal Server Error'
        message: 'Internal Server Error: ' + error.message
    })
});

app.listen(3333, () => {
    console.log('ಠ_ಠ Listening on 3333');
})
