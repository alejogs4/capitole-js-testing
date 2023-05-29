import express from 'express'
import cors from 'cors'
import { CitizenService } from './citizen/domain/citizen.service';
import { getAllCitizensHandler } from './citizen/infraestructure/handlers/get-all-citizens.handler';
import { getCitizenByDNI } from './citizen/infraestructure/handlers/get-citizen-by-dni.handler';
import { getAllCandidates } from './candidate/infraestructure/handlers/get-all-candidates.handler';
import { CandidateService } from './candidate/domain/candidate.service';
import { getCandidateVotes } from './candidate/infraestructure/handlers/get-candidate-votes.handler';
import { voteForCandidate } from './candidate/infraestructure/handlers/vote-candidate.handler';
import { getAllCandidatesVotes } from './candidate/infraestructure/handlers/get-all-candidates-votes.handler';

type ServerDependencies = {
  port: number;
  services: {
    citizenService: CitizenService;
    candidateService: CandidateService;
  }
}

export function startServer({port, services}: ServerDependencies) {
  const app = express()

  app.use(express.json({}))
  app.use(cors())

  // Citizens routes
  app.get('/api/v1/citizens', getAllCitizensHandler(services))
  app.get('/api/v1/citizens/:dni', getCitizenByDNI(services))

  // Candidates routes
  app.get('/api/v1/candidates', getAllCandidates(services))
  app.get('/api/v1/candidates/votes', getAllCandidatesVotes(services))
  app.get('/api/v1/candidates/:dni/votes', getCandidateVotes(services))
  app.post('/api/v1/candidates/vote', voteForCandidate(services))

  return app.listen(port, () => {
    console.log(`Running on port: ${port}`)
  })
}