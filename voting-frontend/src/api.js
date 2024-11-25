import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000' }); // Backend URL

// Voter APIs
export const registerVoter = (data) => API.post('/voter/register', data);

// Candidate APIs
export const registerCandidate = (data) => API.post('/candidate/register', data);
export const fetchCandidates = () => API.get('/candidate/list');

// Voting APIs
export const castVote = (data) => API.post('/vote/cast', data);
