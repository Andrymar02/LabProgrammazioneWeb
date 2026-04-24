import { ListGroup } from 'react-bootstrap'; // Rimosso Button, non serve più qui

function FilmRow({ film, onEdit }) { // Aggiunto onEdit tra le props
  // Formatta la data come "March 10, 2026"
  const formattedDate = film.date ? film.date.format('MMMM D, YYYY') : '';

  return (
    <ListGroup.Item className="d-flex justify-content-between align-items-center py-3">
      
      {/* Parte Sinistra: Cuore e Titolo */}
      <div className="d-flex align-items-center" style={{ width: '35%' }}>
        <i 
          className={`bi ${film.favorite ? 'bi-heart-fill text-danger' : 'bi-heart text-secondary'} me-3`}
          style={{ cursor: 'pointer', fontSize: '1.1rem' }}
        ></i>
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
            ></i>
          ))}
        </span>
        {/* Agganciato l'evento onClick per la modifica */}
        <i 
          className="bi bi-pencil-square me-3" 
          style={{ cursor: 'pointer', fontSize: '1.2rem' }}
          onClick={() => onEdit(film)}
        ></i>
        <i className="bi bi-trash" style={{ cursor: 'pointer', fontSize: '1.2rem' }}></i>
      </div>

    </ListGroup.Item>
  );
}

export default function FilmList({ films, activeFilter, onEdit }) { // Aggiunto onEdit tra le props
  // Genera il titolo dinamicamente
  const title = activeFilter === 'All' ? 'All films' : activeFilter;

  return (
    <div className="position-relative pb-5">
      <h2 className="mb-4 mt-2 fw-bold">{title}</h2>
      
      <ListGroup variant="flush" className="border-top">
        {films.map((film) => (
          <FilmRow 
            key={film.id} 
            film={film} 
            onEdit={onEdit} // Passiamo la funzione alla singola riga
          />
        ))}
      </ListGroup>
    </div>
  );
}