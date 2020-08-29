import { Request, Response } from 'express';

import { container } from 'tsyringe';

import { parseISO } from 'date-fns';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import { AdvancedConsoleLogger } from 'typeorm';

// index, show, create, update, delete
export default class AppointmentsController {
    public async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { providerId, date } = request.body;
        const userId = request.user.id;

        const parsedDate = parseISO(date);
        const createAppointment = container.resolve(CreateAppointmentService);

        const appointment = await createAppointment.execute({
            providerId,
            userId,
            date: parsedDate,
        });

        return response.json(appointment);
    }
}
