import express from 'express';

const app = express();

const unused = 40;

app.use(express.json());

export default app;
