import api from './axiosConfig'; // Assuming you have a central axios instance

// Fetch all elections
export const getElections = () => {
  return api.get('/elections');
};

// Add a new election
// Note: This requires an admin token, which your axios instance should handle
export const addElection = (electionData) => {
  // The backend expects `parties` as the key for the candidate IDs array
  const payload = {
    title: electionData.title,
    dateOfElection: electionData.dateOfElection,
    parties: electionData.candidateIds 
  };
  return api.post('/elections/add', payload);
};

// Delete an election by its ID
export const deleteElection = (electionId) => {
  return api.delete(`/elections/${electionId}`);
};

// You'll also need to fetch all candidates to populate the "Add Election" form
export const getCandidates = () => {
  return api.get('/candidates'); 
};

// Update an existing election
export const updateElection = (electionId, updatedData) => {
  return api.patch(`/elections/${electionId}`, updatedData);
};

export const getElectionResults = () => {
  return api.get('/elections/results');
};

// GET the current live election
export const getCurrentElection = () => {
  return api.get('/elections/current');
};

// Fetch audit details for a specific election
export const getElectionAudit = (electionId) => {
  return api.get(`/elections/${electionId}/audit`);
};

// GET a single election by its ID
export const getElectionById = (electionId) => {
  return api.get(`/elections/${electionId}`);
};

// POST a vote to a specific election
export const castVote = (electionId, candidateId) => {
  // The backend will get the userId from the JWT token
  return api.post(`/elections/${electionId}/vote`, { candidateId });
};

export const getElectionMapResults = (electionId) => {
  return api.get(`/elections/${electionId}/map-results`);
};