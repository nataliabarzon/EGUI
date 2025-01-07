import { AppDataSource } from './data-source'; 

AppDataSource.initialize()
  .then(async () => {
    await AppDataSource.runMigrations();
    console.log('Migrations ran successfully');
  })
  .catch((error) => console.error('Error running migrations', error))
  .finally(() => AppDataSource.destroy());
