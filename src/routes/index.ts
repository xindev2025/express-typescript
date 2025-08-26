import { Express } from 'express';
import AuthRoutes from './auth/auth.route';
import UserRoutes from './user/user.route';
const version = '/v1';

const routes = (app: Express) => {
  app.use(`${version}/authentication`, AuthRoutes);
  app.use(`${version}/user`, UserRoutes);
};

export default routes;
