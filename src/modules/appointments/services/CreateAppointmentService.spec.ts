import { startOfHour } from 'date-fns';
import AppError from '@shared/errors/AppError';
import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

describe('CreateAppointment', () => {
    let fakeAppointmentRepository: FakeAppointmentRepository;
    let createAppointmentService: CreateAppointmentService;

    let providerId: string;
    let userId: string;

    beforeEach(() => {
        fakeAppointmentRepository = new FakeAppointmentRepository();
        createAppointmentService = new CreateAppointmentService(
            fakeAppointmentRepository,
        );

        providerId = 'provider-id';
        userId = 'user-id';
    });

    it('should be able to create a new appointment', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime();
        });

        const appointment = await createAppointmentService.execute({
            date: new Date(2020, 4, 10, 13),
            providerId,
            userId,
        });

        expect(appointment).toHaveProperty('id');
        expect(appointment.provider_id).toBe(providerId);
        expect(appointment.date.toISOString()).toBe(
            startOfHour(new Date(2020, 4, 10, 13)).toISOString(),
        );
    });

    it('should not be able to create two appointments with the same date/time', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime();
        });

        await createAppointmentService.execute({
            date: new Date(2020, 4, 10, 12),
            providerId,
            userId,
        });

        await expect(
            createAppointmentService.execute({
                date: new Date(2020, 4, 10, 12),
                providerId,
                userId,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create an appointment on a past date', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime();
        });

        await expect(
            createAppointmentService.execute({
                date: new Date(2020, 4, 10, 11),
                providerId,
                userId,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create an appointment with the same user and provider', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime();
        });

        await expect(
            createAppointmentService.execute({
                date: new Date(2020, 4, 10, 13),
                providerId: userId,
                userId,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create an appointment before 8am and after 5pm', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 7).getTime();
        });

        await expect(
            createAppointmentService.execute({
                date: new Date(2020, 4, 11, 7),
                providerId,
                userId,
            }),
        ).rejects.toBeInstanceOf(AppError);

        await expect(
            createAppointmentService.execute({
                date: new Date(2020, 4, 11, 18),
                providerId,
                userId,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
