import { startOfHour } from 'date-fns';
import AppError from '@shared/errors/AppError';
import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

describe('CreateAppointment', () => {
    let fakeAppointmentRepository: FakeAppointmentRepository;
    let createAppointmentService: CreateAppointmentService;

    let providerId: string;
    let userId: string;
    let date: Date;

    beforeEach(() => {
        fakeAppointmentRepository = new FakeAppointmentRepository();
        createAppointmentService = new CreateAppointmentService(
            fakeAppointmentRepository,
        );

        providerId = '123456';
        userId = '123123';
        date = new Date();
    });

    it('should be able to create a new appointment', async () => {
        const appointment = await createAppointmentService.execute({
            date,
            providerId,
            userId,
        });

        expect(appointment).toHaveProperty('id');
        expect(appointment.provider_id).toBe(providerId);
        expect(appointment.date.toISOString()).toBe(
            startOfHour(date).toISOString(),
        );
    });

    it('should not be able to create two appointments with the same datetime', async () => {
        await createAppointmentService.execute({
            date,
            providerId,
            userId,
        });

        await expect(
            createAppointmentService.execute({
                date,
                providerId,
                userId,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
