import express from "express";
import morgan from "morgan";
//import per l'autenticazione e le sessioni
import passport from "passport";
import LocalStrategy from "passport-local";
import session from "express-session";

import {allFavoriteFilms, allFilms, beforeThen, getFilmsByTitle, addFilm, removeFilm, getFilmsById, getBestFilms,getFilmsLastMonth, getUnseenFilms, updateFilm, updateRating, updateFavorite, getUser, createUser} from "./filmLibrary.js";
import { check, validationResult } from "express-validator";

//init
const app = express();
const port = 3001;

app.set('json spaces', 2);

//middleware
app.use(morgan("dev"));
app.use(express.json());

passport.use(new LocalStrategy( async function verify(username, password, cd){
    const user = await getUser(username, password);
    if(!user){
        return cd(null, false, {message: "Incorrect username or password"});
    }
    return cd(null, user);
}))


passport.serializeUser(function(user, cd){
    cd(null, user.id);
});

passport.deserializeUser(function (user, cb) {
  return cb(null, user);
});

const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({error: "Not authorized"});
}

app.use(session({
  secret: "shhhhh... it's a secret!",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.authenticate("session"));


//routes
app.get("/", (req, res) =>{
    res.send("Hello World!");
})

// GET /api/films
// GET /api/films (Gestisce sia tutti i film che i filtri)
app.get("/api/films", async (req, res) => {
    try {
        // req.query legge i parametri dopo il punto di domanda
        const filter = req.query.filter; 
        let films;

        // Decidiamo quale funzione chiamare in base al filtro richiesto
        switch (filter) {
            case 'favorite':
                films = await allFavoriteFilms(); 
                break;
            case 'best':
                films = await getBestFilms();
                break;
            case 'lastmonth':
                films = await getFilmsLastMonth();
                break;
            case 'unseen':
                films = await getUnseenFilms();
                break;
            default:
                // Se l'utente non specifica "?filter=", restituisco tutto il catalogo
                films = await allFilms(); 
        }
        res.json(films);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/films/favorite
app.get("/api/films/favorite", async (req, res) => {
    try {
    const films = await allFavoriteFilms();
    if(films.error) {
      res.status(404).json(films);
    }
    else res.json(films);
  }
  catch {
    res.status(500).end();
  }
});

// GET /api/films/beforeDate<date>
app.get("/api/films/beforeDate/:date", async (req, res) => {
    try {
        const films = await beforeThen(req.params.date);
        if(films.error){
            res.status(404).json(films);
        }else{
            res.json(films);
        }
    }catch{
        res.status(500).end();
    }
});

// GET /api/films/title/<title>
app.get("/api/films/title/:title", async (req, res) => {
    try {
        const films = await getFilmsByTitle(req.params.title);
        if(films.error){
            res.status(404).json(films);
        }else{
            res.json(films);
        }
    }catch{
        res.status(500).end();
    }
});

// GET /api/films/id/<id>
app.get("/api/films/id/:id", async (req, res) => {
    try {
        const films = await getFilmsById(req.params.id);
        if(films.error){
            res.status(404).json(films);
        }else{
            res.json(films);
        }
    }catch{
        res.status(500).end();
    }
});

// POST /api/films/add
app.post("/api/films/add", [
    // 1. Validazione dei dati in ingresso
    check('title').isString().notEmpty().withMessage('Il titolo è obbligatorio'),
    check('favorite').optional().isBoolean(),
    check('rating').optional({ nullable: true }).isInt({ min: 1, max: 5 }).withMessage('Il rating deve essere tra 1 e 5'),
    check('watchDate').optional({ nullable: true }).isDate({ format: 'YYYY-MM-DD', strictMode: true }),
    // Nota: l'id lo facciamo passare dal body per come è strutturato il tuo DB ora, 
    // ma in futuro sarà il DB stesso a generarlo in automatico (AUTOINCREMENT).
    check('userID').isInt()
], async (req, res) => {
    
    // 2. Controllo se ci sono stati errori di validazione
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Se i dati non sono validi, rispondo con 400 Bad Request
        return res.status(400).json({ errors: errors.array() });
    }

    // 3. Estrazione dei dati dal body della richiesta
    const filmData = req.body;

    // Creiamo l'oggetto con i dati (gestendo eventuali valori mancanti)
    const newFilm = {
        title: filmData.title,
        favorite: filmData.favorite || false, // se non c'è, default a false
        watchDate: filmData.watchDate || null,
        rating: filmData.rating || null,
        userID: filmData.userID || 1
    };

    // 4. Inserimento nel database
    try {
        await addFilm(newFilm);
        // Rispondo con 201 Created (Risorsa creata con successo)
        res.status(201).end(); 
    } catch (err) {
        // Se fallisce l'inserimento nel DB, rispondo con 503 Service Unavailable
        res.status(503).json({ error: `Errore nell'aggiunta del film: ${err.message}` });
    }
});

// DELETE /api/films//delete/:id
app.delete("/api/films/delete/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if(isNaN(id)){
        return res.status(400).json({error: "ID non valido"});
    }
    try{
        const result = await removeFilm(id);
        if(result.changes === 0){
            res.status(404).json({error: `Film con ID ${id} non trovato`});
        }else{
            res.status(204).end(); // No Content, eliminazione avvenuta con successo
        }
    }catch(err){
        res.status(503).json({error: `Errore nell'eliminazione del film: ${err.message}`});
    }
});

// PUT /api/films/:id
app.put("/api/films/:id", [
    check('title').isString().notEmpty(),
    check('favorite').optional().isBoolean(),
    check('rating').optional({ nullable: true }).isInt({ min: 1, max: 5 }),
    check('watchDate').optional({ nullable: true }).isDate({ format: 'YYYY-MM-DD', strictMode: true }),
    check('userID').isInt()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const filmData = req.body;
        const id = parseInt(req.params.id);
        const filmAggiornato = {
            title: filmData.title,
            favorite: filmData.favorite || false,
            rating: filmData.rating || null,
            watchDate: filmData.watchDate || null,
            userID: filmData.userID || 1
        };

        const changes = await updateFilm(id, filmAggiornato);
        if (changes === 0) return res.status(404).json({ error: "Film non trovato" });
        
        res.status(200).json({ message: "Film aggiornato con successo" });
    } catch (err) {
        res.status(503).json({ error: err.message });
    }
});

// PATCH /api/films/<id>/ratind
app.patch("/api/films/:id/rating", [
    check('rating').isInt({ min: 1, max: 5 }).withMessage("Il voto deve essere tra 1 e 5")
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const id = parseInt(req.params.id);
        const changes = await updateRating(id, req.body.rating);
        
        if (changes === 0) return res.status(404).json({ error: "Film non trovato" });
        res.status(200).json({ message: "Rating aggiornato con successo" });
    } catch (err) {
        res.status(503).json({ error: err.message });
    }
});

//PATCH /api/films/<id>/favorite
app.patch("/api/films/:id/favorite", [
    check('favorite').isBoolean().withMessage("Favorite deve essere true o false")
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const id = parseInt(req.params.id);
        const changes = await updateFavorite(id, req.body.favorite);
        
        if (changes === 0) return res.status(404).json({ error: "Film non trovato" });
        res.status(200).json({ message: "Stato preferito aggiornato con successo" });
    } catch (err) {
        res.status(503).json({ error: err.message });
    }
});

// POST /api/sessions
app.post("/api/sessions", passport.authenticate("local"), function(req, res) {
  return res.status(201).json(req.user);
});

// GET /api/sessions/current
app.get("/api/sessions/current", (req, res) => {
  if(req.isAuthenticated()) {
    res.json(req.user);}
  else
    res.status(401).json({error: "Not authenticated"});
});

// DELETE /api/session/current
app.delete("/api/sessions/current", (req, res) => {
  req.logout(() => {
    res.end();
  });
});

// POST /api/users (Registrazione di un nuovo utente)
app.post("/api/users", [
    // Validazione base dei dati in ingresso
    check('email').isEmail().withMessage("Inserisci un'email valida"),
    check('password').isLength({ min: 6 }).withMessage("La password deve essere di almeno 6 caratteri"),
    check('name').isString().notEmpty().withMessage("Il nome è obbligatorio")
], async (req, res) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const newUser = {
            email: req.body.email,
            password: req.body.password,
            name: req.body.name
        };

        const userId = await createUser(newUser);
        
        // Rispondo con 201 Created e un oggetto che NON contiene la password
        res.status(201).json({ 
            id: userId, 
            email: newUser.email, 
            name: newUser.name 
        });
    } catch (err) {
        // Se l'email esiste già, SQLite lancerà un errore di vincolo UNIQUE (se l'hai impostato)
        if(err.message.includes("UNIQUE constraint failed")){
            res.status(409).json({ error: "Un utente con questa email esiste già." });
        } else {
            res.status(503).json({ error: `Errore nella creazione dell'utente: ${err.message}` });
        }
    }
});

// start the server
app.listen(port, () => {console.log(`API server started at http://localhost:${port}`)});