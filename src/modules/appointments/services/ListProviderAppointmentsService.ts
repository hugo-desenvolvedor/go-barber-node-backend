import { injectable, inject } from 'tsyringe';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

import { getDaysInMonth, getDate } from 'date-fns';
import Appointment from '../infra/typeorm/entities/Appointment';

interface IRequest {
    providerId: string;
    day: number;
    month: number;
    year: number;
}

type IResponse = Array<{ day: number; available: boolean }>;

@injectable()
class ListProviderAppointmentsService {
    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository,
    ) {}

    public async execute({
        providerId,
        day,
        month,
        year,
    }: IRequest): Promise<Appointment[]> {
        const appointments = await this.appointmentsRepository.findAllInDayFromProvider(
            {
                providerId,
                day,
                month,
                year,
            },
        );

        return appointments;
    }
}

export default ListProviderAppointmentsService;
