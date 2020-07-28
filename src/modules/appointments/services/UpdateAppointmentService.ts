import AppointmentsRepository from '@modules/appointments/repositories/AppointmentsRepository';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

class UpdateAppointmentService {
    private appointmentsRepository: AppointmentsRepository;

    constructor(appointmentsRepository: AppointmentsRepository) {
        this.appointmentsRepository = appointmentsRepository;
    }

    public async execute({ id, provider, date }: Appointment): Promise<Appointment> {
        const appointment = await this.appointmentsRepository.update({ id, provider, date });

        return appointment;
    }
}

export default UpdateAppointmentService;