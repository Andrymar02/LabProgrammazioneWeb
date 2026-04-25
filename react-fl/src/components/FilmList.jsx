import { ListGroup, Button, Form } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom'; // Aggiunti import per il routing

function FilmRow({ film, onDelete, onToggleFavorite, onRatingChange }) {
  const formattedDate = film.date ? film.date.format('MMMM D, YYYY') : '';

  return (
    <ListGroup.Item className="d-flex justify-content-between align-items-center py-3">
      
      {/* Parte Sinistra: Checkbox Preferiti e Titolo */}
      <div className="d-flex align-items-center" style={{ width: '35%' }}>
        <Form.Check 
          type="checkbox"
          id={`fav-check-${film.id}`}
          className="me-3"
          checked={film.favorite}
          onChange={() => onToggleFavorite(film.id)} // Operazione in-line via checkbox
        />
        <span style={{ fontSize: '1.1rem' }}>
          {film.title}
        </span>
      </div>

      {/* Parte Centrale: Data */}
      <div className="text-center text-muted" style={{ width: '30%' }}>
        {formattedDate}
      </div>

      {/* Parte Destra: Stelle e Icone di Azione */}
      <div className="d-flex align-items-center justify-content-end text-muted" style={{ width: '35%' }}>
        <span className="me-4">
          {[...Array(5)].map((_, index) => (
            <i 
              key={index} 
              className={`bi ${index < film.rating ? 'bi-star-fill' : 'bi-star'} text-warning me-1`}
              style={{ cursor: 'pointer' }}
              onClick={() => onRatingChange(film.id, index + 1)} // Operazione in-line: cambio rating
            ></i>
          ))}
        </span>
        
        <Link to={`/edit/${film.id}`} className="text-muted">
            <i className="bi bi-pencil-square me-3" style={{ cursor: 'pointer', fontSize: '1.2rem' }}></i>
        </Link>
        
        <i 
            className="bi bi-trash" 
            style={{ cursor: 'pointer', fontSize: '1.2rem', color: 'red' }}
            onClick={() => onDelete(film.id)} // Operazione in-line: eliminazione
        ></i>
      </div>

    </ListGroup.Item>
  );
}

export default function FilmList({ films, onDelete, onToggleFavorite, onRatingChange }) {
  // Otteniamo il filtro attivo direttamente dall'URL!
  const { filterLabel } = useParams();
  const activeFilter = filterLabel || 'All';
  
  const title = activeFilter === 'All' ? 'All films' : activeFilter;

  return (
    <div className="position-relative pb-5">
      <h2 className="mb-4 mt-2 fw-bold">{title}</h2>
      
      <ListGroup variant="flush" className="border-top">
        {films.map((film) => (
          <FilmRow 
            key={film.id} 
            film={film} 
            onDelete={onDelete}
            onToggleFavorite={onToggleFavorite}
            onRatingChange={onRatingChange}
          />
        ))}
      </ListGroup>

      {/* Il bottone + ora naviga alla rotta /add */}
      <Link to="/add">
        <Button 
          variant="primary" 
          className="rounded-circle position-fixed shadow d-flex align-items-center justify-content-center"
          style={{ 
            width: '56px', 
            height: '56px', 
            bottom: '2rem', 
            right: '2rem',
            fontSize: '1.8rem'
          }}
        >
          <i className="bi bi-plus"></i>
        </Button>
      </Link>
    </div>
  );
}