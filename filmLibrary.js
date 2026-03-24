import dayjs from 'dayjs' // metodo standard di JS, i browser capiscono solo questo 
import { use } from 'react';

import crypto from 'crypto';

import sqlite from "sqlite3";
import {Film, FilmLibrary} from "./QAmodels.js";

const db = new sqlite.Database("films.db", (err) =>{
    if(err) throw err;
})



export const addFilm = (film) => {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO films(title, isFavorite, rating, watchDate, userId) VALUES(?,?,?,?,?)";
        db.run(sql, [film.title, film.favorite, film.rating, film.watchDate, film.userID], function(err){ //funzione di callback
        if(err)
            reject(err);
        else 
            resolve(this.lastID);
        });
    });
};

    export const allFilms = () => {
        return new Promise((resolve, reject) => {
            const sql = "SELECT films.* FROM films";
            db.all(sql, [], (err, rows)=>{
                if (err)
                    reject(err);
                else {
                    const films = rows.map(row => 
                    new Film(row.id, row.title, row.isFavorite, row.watchDate, row.rating, row.userId));
                    resolve(films);
                }
            });
        });
    }

    export const allFavoriteFilms = () => {
        return new Promise((resolve, reject) => {
            const sql = "SELECT films.* FROM films WHERE films.isFavorite = 1";
            db.all(sql, [], (err, rows)=>{
                if (err)
                    reject(err);
                else {
                    const films = rows.map(row => 
                    new Film(row.id, row.title, row.isFavorite, row.watchDate, row.rating, row.userId));
                    resolve(films);
                }
            });
        });
    }

    export const beforeThen = (date) => {
        return new Promise((resolve, reject) => {
            const sql = "SELECT films.* FROM films WHERE films.watchDate < ?";
            db.all(sql, [date], (err, rows)=>{
                if (err)
                    reject(err);
                else {
                    const films = rows.map(row => 
                    new Film(row.id, row.title, row.isFavorite, row.watchDate, row.rating, row.userId));
                    resolve(films);
                }
            });
        });
    }

    export const getFilmsByTitle = (searchString) => {
        return new Promise((resolve, reject) => {
            // Usiamo LIKE con % per cercare la stringa ovunque nel titolo
            const sql = "SELECT * FROM films WHERE title LIKE ?";
            
            // Prepariamo la stringa di ricerca: %stringa%
            const pattern = `%${searchString}%`;

            db.all(sql, [pattern], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    // Trasformiamo le righe del DB in oggetti della classe Film
                    const films = rows.map(row => 
                        new Film(row.id, row.title, row.favorite, row.watchDate, row.rating, row.userID)
                    );
                    resolve(films);
                }
            });
        });
    };

    export const getFilmsById = (id) => {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM films WHERE id = ?";

            db.all(sql, [id], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    // Trasformiamo le righe del DB in oggetti della classe Film
                    const films = rows.map(row => 
                        new Film(row.id, row.title, row.favorite, row.watchDate, row.rating, row.userID)
                    );
                    resolve(films);
                }
            });
        });
    };

    

    export const removeFilm = (id) => {
        return new Promise((resolve, reject) => {
            const sql = "DELETE FROM films WHERE films.id = ?";
            db.run(sql, [id], function(err){
                if(err)
                    reject(err);
                else 
                    resolve(this.lastID);
            });
        });
    };

    export const clearWatchDates = () => {
        return new Promise((resolve, reject) => {
            const sql = "UPDATE films SET watchDate = NULL";

            db.run(sql, [], function (err) {
                if (err) {
                    reject(err);
                } else {
                    // 'this.changes' contiene il numero di righe modificate
                    resolve(this.changes);
                }
            });
        });
    };

// Filtro 1: I film migliori (Voto 5)
export const getBestFilms = () => {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM films WHERE rating = 5";
            db.all(sql, [], (err, rows) => {
                if (err) reject(err);
                else {
                    const films = rows.map(row => 
                        new Film(row.id, row.title, row.isFavorite, row.watchDate, row.rating, row.userId)
                    );
                    resolve(films);
                }
            });
        });
    };

    // Filtro 2: Film visti nell'ultimo mese
export const getFilmsLastMonth = () => {
        return new Promise((resolve, reject) => {
            // Calcolo la data di esattamente un mese fa usando dayjs
            const unMeseFa = dayjs().subtract(1, 'month').format('YYYY-MM-DD');
            
            // Cerco i film con una data MAGGIORE o UGUALE a un mese fa
            const sql = "SELECT * FROM films WHERE watchDate >= ?";
            db.all(sql, [unMeseFa], (err, rows) => {
                if (err) reject(err);
                else {
                    const films = rows.map(row => 
                        new Film(row.id, row.title, row.isFavorite, row.watchDate, row.rating, row.userId)
                    );
                    resolve(films);
                }
            });
        });
    };

// Filtro 3: Film non ancora visti (watchDate è NULL)
export const getUnseenFilms = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM films WHERE watchDate IS NULL";
        db.all(sql, [], (err, rows) => {
            if (err) reject(err);
            else {
                const films = rows.map(row => 
                    new Film(row.id, row.title, row.isFavorite, row.watchDate, row.rating, row.userId)
                );
                resolve(films);
            }
        });
    });
};

    export const updateFilm = (id, film) => {
        return new Promise((resolve, reject) => {
            const sql = "UPDATE films SET title=?, isFavorite=?, rating=?, watchDate=?, userId=? WHERE id=?";
            db.run(sql, [film.title, film.favorite, film.rating, film.watchDate, film.userID, id], function(err) {
                if (err) reject(err);
                // Se this.changes è 0, il film non è stato trovato
                else resolve(this.changes); 
            });
        });
    };


    export const updateRating = (id, newRating) => {
        return new Promise((resolve, reject) => {
            const sql = "UPDATE films SET rating=? WHERE id=?";
            db.run(sql, [newRating, id], function(err) {
                if (err) reject(err);
                else resolve(this.changes);
            });
        });
    };

export const updateFavorite = (id, isFavorite) => {
    return new Promise((resolve, reject) => {
        const sql = "UPDATE films SET isFavorite=? WHERE id=?";
        db.run(sql, [isFavorite, id], function(err) {
            if (err) reject(err);
            else resolve(this.changes);
        });
    });
};


/* USERS */
export const getUser = (email, password) => {
  return new Promise((resolve, reject) => {
    // Cerchiamo l'utente tramite email
    const sql = "SELECT * FROM users WHERE email = ?";
    db.get(sql, [email], (err, row) => {
      if (err) { 
        reject(err); 
      }
      else if (row === undefined) { 
        resolve(false); 
      }
      else {
        const user = {id: row.id, username: row.email, name: row.name};
        
        // Ricreiamo l'hash della password inserita usando il salt salvato nel DB
        crypto.scrypt(password, row.salt, 16, function(err, hashedPassword) {
          if (err) reject(err);
          
          // ATTENZIONE QUI: usiamo row.hash, NON row.password!
          if(!crypto.timingSafeEqual(Buffer.from(row.hash, "hex"), hashedPassword))
            resolve(false); // Password sbagliata
          else
            resolve(user);  // Password corretta!
        });
      }
    });
  });
};

export const createUser = (user) => {
  return new Promise((resolve, reject) => {
    // Generiamo il salt
    const salt = crypto.randomBytes(16).toString("hex");

    // Criptiamo la password
    crypto.scrypt(user.password, salt, 16, function(err, hashedPassword) {
      if (err) reject(err);

      // Inseriamo nel DB usando 'hash' come nome della colonna (invece di password)
      const sql = "INSERT INTO users(email, name, salt, hash) VALUES(?, ?, ?, ?)";
      
      // Passiamo la password criptata (hashedPassword)
      db.run(sql, [user.email, user.name, salt, hashedPassword.toString("hex")], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      });
    });
  });
};

/*
    this.updateRating = (id, newRating) => {
        // Prima controlliamo che il nuovo rating sia valido (tra 1 e 5)
        if (newRating < 1 || newRating > 5) {
            console.error(`Impossibile aggiornare: il rating ${newRating} non è valido (deve essere tra 1 e 5).`);
            return; 
        }

        // find() cerca il primo elemento che corrisponde alla condizione
        const filmToUpdate = this.films.find(film => film.ID === id);
        
        // Se il film esiste (cioè find ha trovato qualcosa e non è undefined), lo aggiorniamo
        if (filmToUpdate) {
            filmToUpdate.rating = newRating;
        } else {
            console.log(`Film con ID ${id} non trovato nel catalogo.`);
        }
    };

    this.sortByDate = () => { 
        return [...this.films].sort((a,b) => {
            // Se 'a' non ha la data, lo spostiamo in fondo (ritorniamo un numero positivo)
            if (!a.watchDate) return 1;
            // Se 'b' non ha la data, spostiamo in fondo 'b' (ritorniamo un numero negativo)
            if (!b.watchDate) return -1;
            
            // Ora che siamo sicuri che entrambi hanno la data, usiamo isAfter
            return a.watchDate.isAfter(b.watchDate) ? 1 : -1;
        });
    }

    this.printFilms = () => {
        // Uso della programmazione funzionale (forEach)
        this.films.forEach(film => console.log(film.toString()));
    };

    this.sortByRating = () => {return [...this.films].sort((a,b) => b.rating - a.rating);} // idem, by decreasing rating
*/

async function resetDates() {
    try {
        const numModificati = await catalogo.clearWatchDates();
        console.log(`✅ Successo: Date di visione cancellate per tutti i ${numModificati} film.`);
    } catch (err) {
        console.error("❌ Errore durante la cancellazione delle date:", err.message);
    }
}
/*
const film1 = new Film (6, "Tre uomini ed una gamba", true, "12-10-2015", 5, 1);
const film2 = new Film (2, "Matrix", undefined, "12-10-2015", 3, 1);
const film3 = new Film (3, "Chiedimi se sono felice", true, undefined, 5, 1);
const film4 = new Film (4, "Subaru baracca", true, "12-12-2015", 5, 1);
const catalogo = new FilmLibrary();

//catalogo.addFilm(film1);
//catalogo.removeFilm(6);

const listaFilm = await catalogo.allFilms();
const listaFilmPreferiti = await catalogo.allFavoriteFilms();
const listaBeforeDate = await catalogo.beforeThen("2024-03-20");
const stringaDaCercare = "Pulp";
const risultati = await catalogo.getFilmsByTitle(stringaDaCercare);


const formattaPerStampa = (lista) => lista.map(f => ({
    ...f,
    watchDate: f.watchDate ? f.watchDate.format('YYYY-MM-DD') : 'Nessuna'
}));

console.log("Ho trovato questi film:");
console.table(formattaPerStampa(listaFilm));

console.log("Questi sono quelli preferiti:");
console.table(formattaPerStampa(listaFilmPreferiti));

console.log("Questi sono i film prima della data 2024-03-20:");
console.table(formattaPerStampa(listaBeforeDate));

console.log(`Risultati per la ricerca "${stringaDaCercare}":`);
console.table(formattaPerStampa(risultati));

// Chiamata della funzione
resetDates();


catalogo.addFilm(film2);
catalogo.addFilm(film3);
catalogo.addFilm(film4);

catalogo.printFilms();
console.log("Film ordinati in ordine creacente: \n" + catalogo.sortByDate());
console.log("Film ordinati in ordine di rating: \n" + catalogo.sortByRating());

console.log("\n--- AGGIORNO IL RATING DEL FILM CON ID 2 (Matrix) ---");
catalogo.updateRating(2, 5); // Cambiamo il voto a Matrix
catalogo.printFilms(); // Stampiamo per controllare se si è aggiornato

console.log("\n--- RIMUOVO IL FILM CON ID 4 (Subaru baracca) ---");
catalogo.removeFilm(4); 
catalogo.printFilms(); // Stampiamo per controllare se è sparito
*/
