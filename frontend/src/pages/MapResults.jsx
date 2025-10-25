// src/pages/MapResults.jsx
import React, { useState, useEffect, useMemo } from 'react'; // Import useMemo
import { getElections, getElectionMapResults } from '../api/electionService';
import ElectionMapView from '../components/ElectionMapView';
import MapLegend from '../components/MapLegend';
import toast from 'react-hot-toast';
import { CalendarClock } from 'lucide-react'; // Import an icon for the message

// Helper function to determine election status
const getElectionStatus = (electionDate) => {
    const today = new Date();
    const date = new Date(electionDate);
    today.setHours(0, 0, 0, 0); // Compare dates only
    date.setHours(0, 0, 0, 0);

    if (date.getTime() === today.getTime()) {
        return 'Live';
    } else if (date > today) {
        return 'Future';
    } else {
        return 'Past';
    }
};

const MapResults = () => {
    const [elections, setElections] = useState([]);
    const [selectedElectionId, setSelectedElectionId] = useState('');
    const [mapData, setMapData] = useState([]);
    const [loadingMap, setLoadingMap] = useState(false);
    const [loadingElections, setLoadingElections] = useState(true);

    // Fetch elections on initial load
    useEffect(() => {
        const fetchAllElections = async () => {
            try {
                const { data } = await getElections();
                setElections(data);
                if (data.length > 0) {
                    setSelectedElectionId(data[0]._id); // Select the first one initially
                } else {
                    toast.error('No elections found.');
                }
            } catch (error) {
                toast.error('Failed to load elections.');
            } finally {
                setLoadingElections(false);
            }
        };
        fetchAllElections();
    }, []);

    // Fetch map data when the selected election ID changes
    useEffect(() => {
        if (selectedElectionId) {
            const fetchMapData = async () => {
                setLoadingMap(true);
                try {
                    const { data } = await getElectionMapResults(selectedElectionId);
                    setMapData(data);
                } catch (error) {
                    toast.error('Failed to load map data for this election.');
                    setMapData([]);
                } finally {
                    setLoadingMap(false);
                }
            };
            fetchMapData();
        }
    }, [selectedElectionId]);

    // ✅ Use useMemo to find the currently selected election object and its status
    const selectedElection = useMemo(() => {
        return elections.find(e => e._id === selectedElectionId);
    }, [elections, selectedElectionId]);

    const electionStatus = useMemo(() => {
        return selectedElection ? getElectionStatus(selectedElection.dateOfElection) : null;
    }, [selectedElection]);


    if (loadingElections) {
        return <p className="text-center text-slate-400 p-8">Loading available elections...</p>;
    }

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-4 md:space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h1 className="text-2xl md:text-3xl font-bold text-white text-center md:text-left">
                    Geographical Results
                </h1>
                <select 
                    value={selectedElectionId}
                    onChange={(e) => setSelectedElectionId(e.target.value)}
                    className="w-full md:w-auto px-3 py-2 rounded-md bg-slate-800 border border-slate-700 text-white"
                >
                    {elections.length === 0 && <option disabled>No elections available</option>}
                    {elections.map(e => {
                        // ✅ Determine status for styling the dropdown option
                        const status = getElectionStatus(e.dateOfElection);
                        return (
                            <option 
                                key={e._id} 
                                value={e._id} 
                                // ✅ Add red text style for live elections
                                style={status === 'Live' ? { color: '#f87171' } : {}}
                            >
                                {e.title} ({status})
                            </option>
                        );
                    })}
                </select>
            </div>

            <div className="glass p-2 md:p-4 rounded-lg relative">
                {loadingMap ? (
                    <div style={{ height: '70vh' }} className="flex items-center justify-center">
                        <p className="text-center text-slate-400">Loading Map Data...</p>
                    </div>
                ) : (
                    <>
                        {/* ✅ Apply opacity if the election is in the future */}
                        <div className={electionStatus === 'Future' ? 'opacity-30' : ''}>
                            <ElectionMapView mapData={mapData} />
                        </div>
                        
                        {/* ✅ Show overlay message for future elections */}
                        {electionStatus === 'Future' && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center pointer-events-none">
                                <CalendarClock className="w-16 h-16 text-sky-400 mb-4" />
                                <h2 className="text-2xl font-bold text-white mb-2">Election Upcoming</h2>
                                <p className="text-slate-300">
                                    This election is scheduled for {new Date(selectedElection.dateOfElection).toLocaleDateString()}. Results will be available after the election concludes.
                                </p>
                            </div>
                        )}
                        
                        {/* Only show the legend if the election is not in the future */}
                        {electionStatus !== 'Future' && <MapLegend />}
                    </>
                )}
            </div>
        </div>
    );
};

export default MapResults;
