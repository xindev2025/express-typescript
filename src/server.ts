import app from './app';

const startServer = async () => {
  app.listen(3000, () => {
    console.log(`Server is runnint on port: ${3000}`);
  });

  // Graceful shutdown here
  process.on('SIGINT', async () => {
    process.exit(0);
  });
};

startServer();
