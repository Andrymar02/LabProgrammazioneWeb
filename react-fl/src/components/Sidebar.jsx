import { ListGroup } from 'react-bootstrap';
import { NavLink } from 'react-router-dom'; // Importato NavLink

export default function Sidebar() { // Rimosse le props che non servono più
  const filters = ['All', 'Favorites', 'Best Rated', 'Seen Last Month', 'Unseen'];

  return (
    <>
      <div className="mb-2 text-muted fw-bold ps-3">Filters</div>
      <ListGroup variant="flush">
        {filters.map((filter) => (
          <ListGroup.Item
            key={filter}
            action
            as={NavLink} // Trasforma il ListGroup.Item in un Link per React Router
            to={`/filter/${filter}`} // Genera l'URL per il filtro selezionato
            className="bg-transparent border-0 rounded"
            // Nota: Non serve più "active={...}" perché NavLink aggiunge
            // automaticamente la classe "active" se l'URL corrisponde!
          >
            {filter}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </>
  );
}