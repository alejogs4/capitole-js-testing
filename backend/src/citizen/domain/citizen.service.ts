export interface CitizenService {
  getRegisteredCitizens(): Promise<Array<Citizen>>;
  findCitizenByDNI(dni: string): Promise<Citizen>;
}
