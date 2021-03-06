import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import ListProviderDayAvailabilityService from './ListProviderDayAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderDayAvailability: ListProviderDayAvailabilityService;

describe('ListProviderMonthAvailability', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();

        listProviderDayAvailability = new ListProviderDayAvailabilityService(
            fakeAppointmentsRepository,
        );
    });

    it('should be able to list the hour availability from provider', async () => {
        await fakeAppointmentsRepository.create({
            providerId: 'provider-id',
            userId: 'user-id',
            date: new Date(2020, 4, 20, 14, 0, 0),
        });

        await fakeAppointmentsRepository.create({
            providerId: 'provider-id',
            userId: 'user-id',
            date: new Date(2020, 4, 20, 15, 0, 0),
        });

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 20, 11).getTime();
        });

        const availability = await listProviderDayAvailability.execute({
            providerId: 'provider-id',
            day: 20,
            month: 5,
            year: 2020,
        });

        expect(availability).toEqual(
            expect.arrayContaining([
                { hour: 8, available: false },
                { hour: 9, available: false },
                { hour: 10, available: false },
                { hour: 11, available: false },
                { hour: 12, available: true },
                { hour: 13, available: true },
                { hour: 14, available: false },
                { hour: 15, available: false },
                { hour: 16, available: true },
                { hour: 17, available: true },
            ]),
        );
    });
});
