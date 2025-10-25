// src/pages/Results.jsx
import React, { useState, useEffect } from 'react';
import { getElectionResults } from '../api/electionService';
import ResultCard from '../components/ResultCard'; // We will create this next
import toast from 'react-hot-toast';

const Results = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const { data } = await getElectionResults();
        setResults(data);
      } catch (error) {
        toast.error('Failed to fetch election results.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-white text-center">Election Results</h1>

      {loading ? (
        <p className="text-center text-slate-400">Loading results...</p>
      ) : results.length === 0 ? (
        <div className="glass text-center p-8 rounded-lg">
            <p className="text-slate-400">No completed elections found yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {results.map((result) => (
            <ResultCard key={result.electionId} result={result} />
          ))}
        </div>
      )}
    </div>
  );
};


export default Results;
