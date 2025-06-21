import { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/api';

// Create the context
const PlayerContext = createContext();

// Custom hook to use the player context
export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};

// Provider component
export const PlayerProvider = ({ children }) => {
  const [currentPlayer, setCurrentPlayer] = useState(1); // Default to Player 1
  const [playerNames, setPlayerNames] = useState({
    1: 'Player 1',
    2: 'Player 2'
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch player settings on mount
  useEffect(() => {
    const fetchPlayerSettings = async () => {
      try {
        const player1Settings = await api.getPlayerSettings(1);
        const player2Settings = await api.getPlayerSettings(2);
        
        setPlayerNames({
          1: player1Settings.name,
          2: player2Settings.name
        });
      } catch (error) {
        console.error('Error fetching player settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlayerSettings();
  }, []);

  // Function to toggle between players
  const togglePlayer = () => {
    setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
  };

  // Function to update player names
  const updatePlayerName = async (playerId, name) => {
    try {
      await api.updatePlayerSettings(playerId, { name });
      setPlayerNames(prev => ({
        ...prev,
        [playerId]: name
      }));
    } catch (error) {
      console.error('Error updating player name:', error);
    }
  };

  // Value object to be provided to consumers
  const value = {
    currentPlayer,
    setCurrentPlayer,
    playerNames,
    updatePlayerName,
    togglePlayer,
    currentPlayerName: playerNames[currentPlayer],
    isLoading
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
};

