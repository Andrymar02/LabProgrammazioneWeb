import { useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import dayjs from 'dayjs';

import { INITIAL_FILMS } from './films.js';
import Navigation from './components/Navigation.jsx';
import Sidebar from './components/Sidebar.jsx';
import FilmList from './components/FilmList.jsx';
import FilmForm from './components/FilmForm.jsx';

function App() {
  const [films, setFilms] = useState(INITIAL_FILMS);
  const [activeFilter, setActiveFilter] = useState('All');

  // Nuovi stati per la gestione del form
  const [showForm, setShowForm] = useState(false);
  const [filmToEdit, setFilmToEdit] = useState(null);

  // Funzione per salvare (aggiungere o modificare) un film
  const handleSaveFilm = (film) => {
    if (filmToEdit) {
      // Modifica: sostituiamo il film esistente con quello aggiornato
      setFilms(films.map(f => f.id === film.id ? film : f));
    } else {
      // Aggiunta: creiamo un nuovo ID e aggiungiamo alla lista
      const newId = Math.max(...films.map(f => f.id), 0) + 1;
      setFilms([...films, { ...film, id: newId }]);
    }
    // Chiudiamo il form dopo aver salvato
    setShowForm(false);
    setFilmToEdit(null);
  };

  // Funzione per preparare la modifica di un film
  const handleEditFilm = (film) => {
    setFilmToEdit(film);
    setShowForm(true);
  };

  const getFilteredFilms = () => {
    switch (activeFilter) {
      case 'Favorites':
        return films.filter(f => f.favorite);
      case 'Best Rated':
        return films.filter(f => f.rating === 5);
      case 'Seen Last Month':
        return films.filter(f => {
          if (!f.date) return false;
          const diff = dayjs().diff(f.date, 'day');
          return diff >= 0 && diff <= 30;
        });
      case 'Unseen':
        return films.filter(f => !f.date);
      case 'All':
      default:
        return films;
    }
  };

  const filteredFilms = getFilteredFilms();

  return (
    <>
      <Navigation />
      <Container fluid>
        <Row>
          {/* Sidebar */}
          <Col md={3} className="bg-light vh-100 pt-3">
            <Sidebar 
              activeFilter={activeFilter} 
              onSelectFilter={setActiveFilter} 
            />
          </Col>
          
          {/* Contenuto Principale */}
          <Col md={9} className="pt-3">
            <h2 className="mb-4">Filtro: {activeFilter}</h2>
            
            {/* Passiamo handleEditFilm a FilmList per usarlo sui bottoni di modifica */}
            <FilmList 
              films={filteredFilms} 
              onEdit={handleEditFilm} 
            />

            {/* Mostriamo il form se showForm è true, altrimenti il bottone + */}
            {showForm ? (
              <FilmForm 
                filmToEdit={filmToEdit} 
                onSave={handleSaveFilm} 
                onCancel={() => { setShowForm(false); setFilmToEdit(null); }} 
              />
            ) : (
              <Button 
                variant="primary" 
                size="lg" 
                className="mt-3 rounded-circle fixed-bottom ms-auto me-4 mb-4" 
                style={{ width: '60px', height: '60px' }}
                onClick={() => { setShowForm(true); setFilmToEdit(null); }}
              >
                +
              </Button>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App;