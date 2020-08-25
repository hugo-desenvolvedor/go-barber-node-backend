import { Router } from 'express';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticate';
import AppointmentsController from '../controllers/AppointmentsController';
// import MonthAvailabilityController from '../controllers/monthAvailabilityController';

const appointmentsRouter = Router();
const appointmentsController = new AppointmentsController();

appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.post('/', appointmentsController.create);
// appointmentsRouter.post(
//     '/month-availability/:userId',
//     monthAvailabilityController.show(),
// );

export default appointmentsRouter;
