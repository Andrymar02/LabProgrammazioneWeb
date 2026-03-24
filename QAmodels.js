import dayjs from "dayjs";

function Film (id, title, favorite, watchDate, rating, userID){
    this.id = id;
    this.title = title;
    this.favorite = favorite ? favorite : false;
    this.watchDate = watchDate ? dayjs(watchDate) : undefined;
    if (rating && (rating < 1 || rating > 5)) {
        throw new Error(`Errore: il rating per "${this.title}" deve essere compreso tra 1 e 5.`);
    }
    this.rating = rating ?? null;
    this.userID = userID;

    this.toString = () => {
        const dateStr = this.watchDate ? this.watchDate.format('DD MM YYYY') : 'undefined';
        return `Id: ${this.id}, Title: ${this.title}, Favorite: ${this.favorite}, Watch date: ${dateStr}, Rating: ${this.rating || 'undefined'}, User id: ${this.userID} \n`;
    };

}


function FilmLibrary(){
    this.films = [];
}

export {Film, FilmLibrary};
