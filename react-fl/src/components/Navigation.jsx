import { Navbar, Container, Form, InputGroup } from 'react-bootstrap';

export default function Navigation() {
  return (
    <Navbar bg="primary" variant="dark" expand="lg">
      <Container fluid>
        {/* Sinistra: Logo e Titolo */}
        <Navbar.Brand href="#">
          <i className="bi bi-collection-play me-2"></i>
          Film Library
        </Navbar.Brand>

        {/* Centro: Barra di ricerca */}
        <Form className="d-flex w-50 mx-auto">
          <Form.Control
            type="search"
            placeholder="Search..."
            className="me-2 rounded"
            aria-label="Search"
          />
        </Form>

        {/* Destra: Profilo utente */}
        <Navbar.Text className="text-white">
          <i className="bi bi-person-circle fs-4"></i>
        </Navbar.Text>
      </Container>
    </Navbar>
  );
}