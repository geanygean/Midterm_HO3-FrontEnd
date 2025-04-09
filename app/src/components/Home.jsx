import React, { useState, useEffect } from 'react';

const Home = () => {
  const [pokemon, setPokemon] = useState(null);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setPokemon(null);
    
    const apiUrl = `https://localhost:7064/api/Pokemon/name/${searchTerm.trim().toLowerCase()}`;
    
    try {
      console.log('Fetching from:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Data received:', data);
      setPokemon(data);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(`${err.message} - This may be a CORS issue or the API is not running.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>Pokémon Search</h1>
      
      <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Enter a Pokémon name (e.g., Pikachu, Treecko)"
          style={{ padding: '8px', marginRight: '10px', width: '250px' }}
        />
        <button 
          type="submit" 
          style={{ padding: '8px 16px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Search
        </button>
      </form>
      
      {isLoading && <p>Loading...</p>}
      {error && (
        <div style={{ padding: '15px', backgroundColor: '#ffebee', borderLeft: '5px solid #f44336', marginBottom: '20px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {pokemon && (
        <div style={{ padding: '20px', backgroundColor: '#e8f5e9', borderRadius: '8px', marginBottom: '20px' }}>
          <h2 style={{ marginTop: '0' }}>{pokemon.name}</h2>
          <p><strong>ID:</strong> {pokemon.id}</p>
          <p><strong>Type:</strong> {pokemon.type}{pokemon.secondaryType ? ` / ${pokemon.secondaryType}` : ''}</p>
          <p><strong>Generation:</strong> {pokemon.generation}</p>
        </div>
      )}
      
      {!pokemon && !isLoading && !error && searchTerm && <p>No Pokémon found for "{searchTerm}"</p>}
    </div>
  );
};

export default Home;