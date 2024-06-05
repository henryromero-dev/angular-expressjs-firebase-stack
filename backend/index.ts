import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Routes } from './src/routes';
import  * as dotenv from 'dotenv';
import { Seeders } from './src/migration/seeders';

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

Routes(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

//Seeders.LoadRoles();
//Seeders.LoadTaskStatuses();