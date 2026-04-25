import 'bootstrap-icons/font/bootstrap-icons.css';
import { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { BrowserRouter, Routes, Route, Navigate, useParams, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

import { INITIAL_FILMS } from './films.js';
import Navigation from './components/Navigation.jsx';
import Sidebar from './components/Sidebar.jsx';
import FilmList from './components/FilmList.jsx';
import FilmForm from './components/FilmForm.jsx';

// Componente per gestire la visualizzazione filtrata
function FilteredFilmList({ films, onDelete, onToggleFavorite, onRatingChange }) {
  const { filterLabel } = useParams(); // Legge il filtro dall'URL
  const activeFilter = filterLabel || 'All';

  const getFilteredFilms = () => {
    switch (activeFilter) {
      case 'Favorites': return films.filter(f => f.favorite);
      case 'Best Rated': return films.filter(f => f.rating === 5);
      case 'Seen Last Month':
        return films.filter(f => {
          if (!f.date) return false;
          const diff = dayjs().diff(f.date, 'day');
          return diff >= 0 && diff <= 30;
        });
      case 'Unseen': return films.filter(f => !f.date);
      default: return films;
    }
  };

  return (
    <FilmList 
      films={getFilteredFilms()} 
      activeFilter={activeFilter}
      onDelete={onDelete}
      onToggleFavorite={onToggleFavorite}
      onRatingChange={onRatingChange}
    />
  );
}

// Componente per la rotta di Modifica
function EditRoute({ films, onSave }) {
  const { filmId } = useParams();
  const navigate = useNavigate();
  const filmToEdit = films.find(f => f.id === parseInt(filmId));

  if (!filmToEdit) return <Navigate to="/404" />;

  return (
    <FilmForm 
      filmToEdit={filmToEdit} 
      onSave={onSave} 
      onCancel={() => navigate(-1)} 
    />
  );
}

// Pagina 404
function NotFound() {
  return (
    <div className="text-center mt-5">
      <h1>404</h1>
      <p>Pagina non trovata! La forza non è con te in questo URL.</p>
    </div>
  );
}

// Pagina Login (Dummy)
function LoginForm() {
    const navigate = useNavigate();
    return (
        <Container className="mt-5 text-center">
            <h2>Login</h2>
            <button className="btn btn-primary mt-3" onClick={() => navigate('/')}>
                Accedi (Simulato)
            </button>
        </Container>
    );
}

function App() {
  const [films, setFilms] = useState(INITIAL_FILMS);

  // Funzioni CRUD (Save, Delete, Toggle Favorite, Update Rating)
  const handleSaveFilm = (film) => {
    if (film.id) {
      setFilms(old => old.map(f => f.id === film.id ? film : f));
    } else {
      const newId = Math.max(...films.map(f => f.id), 0) + 1;
      setFilms(old => [...old, { ...film, id: newId }]);
    }
  };

  const deleteFilm = (id) => setFilms(old => old.filter(f => f.id !== id));
  const toggleFavorite = (id) => {
    setFilms(old => old.map(f => f.id === id ? { ...f, favorite: !f.favorite } : f));
  };
  const updateRating = (id, rating) => {
    setFilms(old => old.map(f => f.id === id ? { ...f, rating: rating } : f));
  };

  return (
    <BrowserRouter>
      {/* La Navigation Bar è sempre visibile in alto */}
      <Navigation />
      <Container fluid>
        <Row>
          {/* La Sidebar è sempre visibile a sinistra */}
          <Col md={3} className="bg-light vh-100 pt-3">
            <Sidebar />
          </Col>
          
          <Col md={9} className="pt-3">
            <Routes>
              {/* Rotte Principali */}
              <Route index element={<Navigate replace to="/filter/All" />} />
              
              <Route path="filter/:filterLabel" element={
                <FilteredFilmList 
                  films={films} 
                  onDelete={deleteFilm} 
                  onToggleFavorite={toggleFavorite} 
                  onRatingChange={updateRating} 
                />
              } />

              <Route path="add" element={
                <AddRouteWrapper onSave={handleSaveFilm} />
              } />
              
              <Route path="edit/:filmId" element={
                <EditRoute films={films} onSave={handleSaveFilm} />
              } />

              {/* Rotte Login e 404 (ora mostrano Sidebar e Navbar) */}
              <Route path="login" element={<LoginForm />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Col>
        </Row>
      </Container>
    </BrowserRouter>
  );
}

function AddRouteWrapper({ onSave }) {
  const navigate = useNavigate();
  return (
    <FilmForm 
      onSave={onSave} 
      onCancel={() => navigate('/')} // Navigazione programmatica
    />
  );
}

export default App;