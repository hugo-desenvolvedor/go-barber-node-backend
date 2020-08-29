import { startOfHour } from 'date-fns';
import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentRepository from '@modules/appointments/repositories/IAppointmentsRepository';

/**
 * DTO - Data transfer object
 */
interface IRequest {
    providerId: string;
    userId: string;
    date: Date;
}

@injectable()
class CreateAppointmentService {
    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentRepository,
    ) {}

    public async execute({
        date,
        providerId,
        userId,
    }: IRequest): Promise<Appointment> {
        const appointmentDate = startOfHour(date);

        const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
            appointmentDate,
        );

        if (findAppointmentInSameDate) {
            throw new AppError('This appointment is already booked');
        }

        const appointment = this.appointmentsRepository.create({
            providerId,
            userId,
            date: appointmentDate,
        });

        return appointment;
    }
}

export default CreateAppointmentService;
