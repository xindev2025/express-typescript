import { Express } from 'express';
import AuthRoutes from './auth/auth.route';
const version = '/v1';

const routes = (app: Express) => {
  app.use(`${version}/authentication`, AuthRoutes);
};

export default routes;
