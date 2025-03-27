import { useState, useEffect } from "react";
import axios from "axios";

// Substitua pela sua chave da API TMDb
const API_KEY = "431219b2d7d84b38c6954326730c1c09";
const API_URL = "https://api.themoviedb.org/3";

function App() {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Função para buscar filmes
  const fetchMovies = (query) => {
    setLoading(true);
    setError(null);
    axios
      .get(`${API_URL}/search/movie?api_key=${API_KEY}&query=${query}`)
      .then((response) => {
        setMovies(response.data.results);
        setLoading(false);
      })
      .catch((error) => {
        setError("Erro ao buscar filmes.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMovies("Inception"); // Buscar um filme padrão ao carregar
  }, []);

  return (
    <div className="app-container">
      <h1 className="title">Buscador de Filmes</h1>
      <input
        type="text"
        className="search-bar"
        placeholder="Digite o nome do filme"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button className="search-button" onClick={() => fetchMovies(query)}>
        Buscar Filmes
      </button>

      {loading && <p className="loading-text">Carregando...</p>}
      {error && <p className="error-text">{error}</p>}

      <div className="movie-list">
        {movies.map((movie) => (
          <div key={movie.id} className="movie-card">
            <img
              className="movie-poster"
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
            />
            <div className="movie-description">
              <h2>{movie.title}</h2>
              <p>{movie.overview.length > 100 ? movie.overview.substring(0, 100) + "..." : movie.overview}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
