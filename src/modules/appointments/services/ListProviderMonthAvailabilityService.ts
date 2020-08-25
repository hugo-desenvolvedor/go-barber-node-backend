import { injectable, inject } from 'tsyringe';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

interface IRequest {
    providerId: string;
    year: number;
    month: number;
}

type IResponse = Array<{ day: number; available: boolean }>;

@injectable()
class ListProviderMonthAvailabilityService {
    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository,
    ) {}

    public async execute({
        providerId,
        year,
        month,
    }: IRequest): Promise<IResponse> {
        const appointments = await this.appointmentsRepository.findAllInMonthFromProvider(
            {
                providerId,
                year,
                month,
            },
        );

        return [{ day: 1, available: false }];
        // return appointments;
    }
}

export default ListProviderMonthAvailabilityService;
