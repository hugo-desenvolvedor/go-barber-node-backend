import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderMonthAvailability: ListProviderMonthAvailabilityService;

describe('ListProviderMonthAvailability', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();

        listProviderMonthAvailability = new ListProviderMonthAvailabilityService(
            fakeAppointmentsRepository,
        );
    });

    it('should be able to list the month availability from provider', async () => {
        const scheduleAllDay = async (day: number, month: number) => {
            // const availableHours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
            const availableHours = Array.from(
                { length: 10 },
                (_, index) => index + 8,
            );

            const resolvedFinalArray = await Promise.all(
                availableHours.map(async hour => {
                    return fakeAppointmentsRepository.create({
                        providerId: 'user-id',
                        date: new Date(2020, month - 1, day, hour, 0, 0),
                    });
                }),
            );

            return resolvedFinalArray;
        };

        scheduleAllDay(20, 5);

        await fakeAppointmentsRepository.create({
            providerId: 'user-id',
            date: new Date(2020, 4, 21, 10, 0, 0),
        });

        const availability = await listProviderMonthAvailability.execute({
            providerId: 'user-id',
            year: 2020,
            month: 5,
        });

        expect(availability).toEqual(
            expect.arrayContaining([
                { day: 19, available: true },
                { day: 20, available: false },
                { day: 21, available: true },
                { day: 22, available: true },
            ]),
        );
    });
});
