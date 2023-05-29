import * as dotenv from 'dotenv'
dotenv.config({
  path: `${__dirname}/sample.env`
})

import { startServer } from "./routes";
import { buildCandidateFileRepository } from './candidate/infraestructure/candidate-file.repository';
import { buildFileCitizenRepository } from './citizen/infraestructure/citizen-file.repository';

const candidateServicePath = `${__dirname}/data/candidates.json`
const citizenServicePath = `${__dirname}/data/citizens.json`

startServer({
  port: Number(process.env.PORT) || 8000,
  services: {
    candidateService: buildCandidateFileRepository(candidateServicePath),
    citizenService: buildFileCitizenRepository(citizenServicePath)
  }
})
