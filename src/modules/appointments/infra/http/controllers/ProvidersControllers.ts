import { Request, Response } from 'express';

import { container } from 'tsyringe';

import { parseISO } from 'date-fns';

import ListProvidersService from '@modules/appointments/services/ListProvidersService';

// index, show, create, update, delete
export default class ProvidersController {
    public async index(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { userId } = request.body;

        const listProviders = container.resolve(ListProvidersService);

        const providers = await listProviders.execute({
            userId,
        });

        return response.json(providers);
    }
}
