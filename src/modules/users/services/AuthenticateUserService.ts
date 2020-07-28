import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';

interface IRequest {
    email: string;
    password: string;
}

interface IResponse {
    user: User;
    token: string;
}

@injectable()
class AuthenticateUserService {
    constructor (
        @inject('UsersRepository')
        private usersRepository: IUsersRepository
    ) {};
    
    public async execute({ email, password }: IRequest): Promise<IResponse> {
        
        const user = await this.usersRepository.findByEmail(email);

        if (!user) {
            throw new AppError('Incorrect email/password combination', 401);
        }

        const passwordMatched = await compare(password, user.password);

        if (!passwordMatched) {
            throw new AppError('Incorrect email/password combination', 401);
        }

        delete user.password;

        const token = sign(
            {

            },
            authConfig.jwt.secret,
            {
                subject: user.id,
                expiresIn: authConfig.jwt.expiresIn
            }
        );

        return {
            user,
            token
        }

    }
}

export default AuthenticateUserService;