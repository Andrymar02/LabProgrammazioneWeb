import { ListGroup } from 'react-bootstrap';

export default function Sidebar({ activeFilter, onSelectFilter }) {
  const filters = ['All', 'Favorites', 'Best Rated', 'Seen Last Month', 'Unseen'];

  return (
    <>
      <div className="mb-2 text-muted fw-bold ps-3">Filters</div>
      <ListGroup variant="flush">
        {filters.map((filter) => (
          <ListGroup.Item
            key={filter}
            action
            active={activeFilter === filter}
            onClick={() => onSelectFilter(filter)}
            className="bg-transparent border-0 rounded"
          >
            {filter}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </>
  );
}