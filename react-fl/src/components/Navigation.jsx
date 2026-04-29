import { Navbar, Container, Form, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

export default function Navigation() {
  const navigate = useNavigate();

  const handleSearch = (event) => {
    event.preventDefault(); // Blocca il ricaricamento della pagina di default
    
    // Navighiamo verso un URL non definito nelle nostre rotte. 
    // Questo farà scattare in automatico la rotta "*" (NotFound) di App.jsx!
    navigate('/search'); 
  };


  return (
    <Navbar bg="primary" variant="dark" expand="lg">
      <Container fluid>
        {/* Sinistra: Logo e Titolo */}
        <Navbar.Brand as={Link} to ="/">
          <i className="bi bi-collection-play me-2"></i>
          Film Library
        </Navbar.Brand>

        {/* Centro: Barra di ricerca */}
        <Form className="d-flex w-50 mx-auto" onSubmit={handleSearch}>
          <Form.Control
            type="search"
            placeholder="Search..."
            className="me-2 rounded"
            aria-label="Search"
          />
        </Form>

        {/* Destra: Profilo utente */}
        <Navbar.Brand as={Link} to="/login" className="text-white">
          <i className="bi bi-person-circle fs-4"></i>
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
}