import AppointmentsRepository from '@modules/appointments/repositories/AppointmentsRepository';

class DeleteAppointmentService {
    private appointmentsRepository: AppointmentsRepository;
    
    constructor(appointmentsRepository: AppointmentsRepository) {
        this.appointmentsRepository = appointmentsRepository;
    }

    public async  execute(id: string): Promise<boolean> {
        const appointment = await this.appointmentsRepository.delete(id);

        if (!appointment) {
            throw Error(`This appointment doesn't exist. ID [${id}]`)
        }

        return !!appointment;
    }
}

export default DeleteAppointmentService;