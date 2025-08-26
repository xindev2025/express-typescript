import express from 'express';
import routes from './routes';
import ErrorHandler from './middlewares/error-handling';
const app = express();

app.use(express.json());

/**
 * middleware
 * cors
 * helmet
 */

// application routes
routes(app);

// handling errors
app.use(ErrorHandler);

export default app;
