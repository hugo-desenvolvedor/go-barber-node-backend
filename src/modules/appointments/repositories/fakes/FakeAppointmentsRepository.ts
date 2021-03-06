import { uuid } from 'uuidv4';
import { isEqual, getMonth, getYear, getDate } from 'date-fns';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';

class AppointmentsRepository implements IAppointmentRepository {
    private appointments: Appointment[] = [];

    public async findByDate(date: Date): Promise<Appointment | undefined> {
        const findAppointment = this.appointments.find(appointment =>
            isEqual(appointment.date, date),
        );

        return findAppointment;
    }

    public async create({
        providerId,
        userId,
        date,
    }: ICreateAppointmentDTO): Promise<Appointment> {
        const appointment = new Appointment();

        Object.assign(appointment, {
            id: uuid(),
            date,
            provider_id: providerId,
            user_id: userId,
        });

        this.appointments.push(appointment);

        return appointment;
    }

    public async findAllInMonthFromProvider({
        providerId,
        month,
        year,
    }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
        const appointments = this.appointments.filter(appointment => {
            return (
                appointment.provider_id === providerId &&
                getMonth(appointment.date) + 1 === month &&
                getYear(appointment.date) === year
            );
        });

        return appointments;
    }

    public async findAllInDayFromProvider({
        providerId,
        month,
        year,
        day,
    }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
        const appointments = this.appointments.filter(appointment => {
            return (
                appointment.provider_id === providerId &&
                getDate(appointment.date) === day &&
                getMonth(appointment.date) + 1 === month &&
                getYear(appointment.date) === year
            );
        });

        return appointments;
    }
}

export default AppointmentsRepository;
