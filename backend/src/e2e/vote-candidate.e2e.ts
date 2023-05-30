import axios, { AxiosInstance, isAxiosError } from 'axios'
import { writeFile, rm, open, mkdir } from "fs/promises"
import { buildCandidate } from "../test-utils/builders/candidate-builder"
import { buildCitizen } from "../test-utils/builders/citizen-builder"
import { fromDomainCandidateToFile } from "../candidate/infraestructure/mappers"
import { fromCitizenDomainToFile } from "../citizen/infraestructure/mappers"
import path from "path"
import { Candidate } from "../candidate/domain/candidate"
import { Citizen } from "../citizen/domain/citizen"
import { startServer } from "../routes"
import { buildCandidateFileRepository } from "../candidate/infraestructure/candidate-file.repository"
import { buildFileCitizenRepository } from "../citizen/infraestructure/citizen-file.repository"
import { Server } from "http"
import { HTTP_CODES } from '../http-utills/constants/https-codes'
import { AddressInfo } from 'net'

function buildFilePath(type: 'candidates' | 'citizens') {
  return path.join(__dirname, 'data', `data-test-${type}-${process.env.JEST_WORKER_ID}.json`) 
}

async function seedVoteInformation() {
  const candidates = buildCandidate.many(3)
  const citizens = buildCitizen.many(10)

  await mkdir(path.join(__dirname, 'data')).catch(() => {})

  await writeFile(buildFilePath('candidates'), JSON.stringify(
    candidates.map(fromDomainCandidateToFile)
  ))

  await writeFile(buildFilePath('citizens'), JSON.stringify(
    citizens.map(fromCitizenDomainToFile)
  ))

  return {candidates, citizens}
}

async function removeInformation() {
  await rm(buildFilePath('candidates'), {
    recursive: true,
  })
  await rm(buildFilePath('citizens'), {
    recursive: true
  })
}

let candidate: Candidate
let citizen: Citizen
let server: Server
let api: AxiosInstance

beforeAll(async () => {
  const port = 8800 + Number(process.env.JEST_WORKER_ID || 0)
  server = await startServer({
    port: port,
    services: {
    candidateService: buildCandidateFileRepository(buildFilePath('candidates')),
    citizenService: buildFileCitizenRepository(buildFilePath('citizens'))
  }})

  api = axios.create({ baseURL: `http://localhost:${(server.address() as AddressInfo).port}` })

  const { candidates, citizens } = await seedVoteInformation()

  candidate = candidates[0]
  citizen = citizens[0]
})

afterAll(async () => {
  await removeInformation()
  await server.close()
})

describe('vote candidate http handler e2e', () => {
  test('Should returns 201 if seller has not voted and 400 it has voted before', async ()=> {
    const response = await api.post('/api/v1/candidates/vote', {
      citizen_dni: citizen.dni,
      candidate_dni: candidate.dni
    })
    
    expect(response.status).toBe(HTTP_CODES.CREATED)
    try {
      await api.post('/api/v1/candidates/vote', {
        citizen_dni: citizen.dni,
        candidate_dni: candidate.dni
      })
      throw new Error('This should have thrown')
    } catch (error) {
      if (isAxiosError(error)) {
        expect(error.response?.status).toBe(HTTP_CODES.BAD_REQUEST)
      } else {
        throw new Error('No http error')
      }
    }
  })

  test('Should returns 404 if citizen does not exist', async ()=> {
    const responseCitizen = await api.post('/api/v1/candidates/vote', {
      citizen_dni: 'not exist',
      candidate_dni: candidate.dni
    })
    .catch(err => isAxiosError(err) ? {status: err.response?.status} : {status: 500})

    expect(responseCitizen.status).toBe(HTTP_CODES.NOT_FOUND)
  })
})

