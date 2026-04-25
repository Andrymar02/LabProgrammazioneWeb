import { useActionState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

export default function FilmForm({ filmToEdit, onSave, onCancel }) {
  const navigate = useNavigate();
  const handleFormSubmit = async (prevState, formData) => {
    const title = formData.get('title');
    const favorite = formData.get('favorite') === 'on';
    const dateStr = formData.get('date');
    const rating = parseInt(formData.get('rating'), 10) || 0;

    // Struttura aggiornata per gestire sia i messaggi che i campi specifici da evidenziare
    const validation = {
      messages: [],
      invalidFields: { title: false, rating: false, date: false }
    };

    // Validazione opzionale: Titolo non vuoto e non solo spazi
    if (!title || title.trim() === '') {
      validation.messages.push('Il titolo non può essere vuoto o composto solo da spazi.');
      validation.invalidFields.title = true;
    }
    
    // Validazione base: Rating tra 0 e 5
    if (rating < 0 || rating > 5) {
      validation.messages.push('Il rating deve essere compreso tra 0 e 5.');
      validation.invalidFields.rating = true;
    }
    
    let parsedDate = null;
    if (dateStr) {
      parsedDate = dayjs(dateStr);
      // Validazione opzionale: Data non nel futuro
      if (parsedDate.isAfter(dayjs(), 'day')) {
        validation.messages.push('La data non può essere nel futuro.');
        validation.invalidFields.date = true;
      }
    }

    // Se ci sono errori, annulliamo il salvataggio e ritorniamo gli errori e i campi da evidenziare
    if (validation.messages.length > 0) {
      return validation;
    }

    const submittedFilm = {
      id: filmToEdit ? filmToEdit.id : undefined,
      title: title.trim(),
      favorite,
      date: parsedDate,
      rating
    };

    onSave(submittedFilm);
    navigate('/');

    return { messages: [], invalidFields: {} };
  };

  // Stato iniziale inizializzato con la nuova struttura
  const [state, formAction, isPending] = useActionState(handleFormSubmit, { 
    messages: [], 
    invalidFields: { title: false, rating: false, date: false } 
  });

  const defaultDate = filmToEdit?.date ? filmToEdit.date.format('YYYY-MM-DD') : '';

  return (
    <Form action={formAction} className="border p-4 mt-4 rounded bg-light">
      <h4 className="mb-3">{filmToEdit ? 'Modifica Film' : 'Aggiungi Nuovo Film'}</h4>

      {/* Messaggi di errore chiari */}
      {state.messages.map((err, index) => (
        <Alert variant="danger" key={index}>{err}</Alert>
      ))}

      <Form.Group className="mb-3" controlId="formTitle">
        <Form.Label>Titolo</Form.Label>
        <Form.Control 
          type="text" 
          name="title" 
          defaultValue={filmToEdit ? filmToEdit.title : ''} 
          placeholder="Inserisci il titolo"
          isInvalid={state.invalidFields.title} /* Evidenziazione visiva del campo non valido */
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formDate">
        <Form.Label>Data di visione</Form.Label>
        <Form.Control 
          type="date" 
          name="date" 
          defaultValue={defaultDate}
          isInvalid={state.invalidFields.date} /* Evidenziazione visiva del campo non valido */
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formRating">
        <Form.Label>Voto (0-5)</Form.Label>
        <Form.Control 
          type="number" 
          name="rating" 
          min="0" 
          max="5" 
          defaultValue={filmToEdit ? filmToEdit.rating : 0}
          isInvalid={state.invalidFields.rating} /* Evidenziazione visiva del campo non valido */
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formFavorite">
        <Form.Check 
          type="checkbox" 
          name="favorite" 
          label="Aggiungi ai preferiti" 
          defaultChecked={filmToEdit ? filmToEdit.favorite : false} 
        />
      </Form.Group>

      <div className="d-flex gap-2">
        <Button variant="primary" type="submit" disabled={isPending}>
          {isPending ? 'Salvataggio...' : 'Salva'}
        </Button>
        <Button variant="secondary" onClick={onCancel}>
          Annulla
        </Button>
      </div>
    </Form>
  );
}