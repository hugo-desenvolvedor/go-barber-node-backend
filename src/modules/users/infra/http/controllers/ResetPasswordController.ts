import { Request, Response } from 'express';

import ResetPasswordService from '@modules/users/services/ResetPasswordService';

import { container } from 'tsyringe';

// index, show, create, update, delete
export default class ResetPasswordServiceController {
    public async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { token, password } = request.body;

        const resetPassword = container.resolve(ResetPasswordService);

        await resetPassword.execute({
            token,
            password,
        });

        return response.status(204).json();
    }
}
