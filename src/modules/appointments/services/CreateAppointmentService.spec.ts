import { startOfHour } from 'date-fns';
import AppError from '@shared/errors/AppError';
import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

describe('CreateAppointment', () => {
    it('should be able to create a new appointment', async () => {
        const fakeAppointmentRepository = new FakeAppointmentRepository();
        const createAppointmentService = new CreateAppointmentService(
            fakeAppointmentRepository,
        );

        const provider_id = '123456';
        const date = new Date();

        const appointment = await createAppointmentService.execute({
            date,
            provider_id,
        });

        expect(appointment).toHaveProperty('id');
        expect(appointment.provider_id).toBe(provider_id);
        expect(appointment.date.toISOString()).toBe(
            startOfHour(date).toISOString(),
        );
    });

    it('should not be able to create two appointments with the same datetime', async () => {
        const fakeAppointmentRepository = new FakeAppointmentRepository();
        const createAppointmentService = new CreateAppointmentService(
            fakeAppointmentRepository,
        );

        const provider_id = '123456';
        const date = new Date();

        const appointment = await createAppointmentService.execute({
            date,
            provider_id,
        });

        await expect(
            createAppointmentService.execute({
                date,
                provider_id,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
