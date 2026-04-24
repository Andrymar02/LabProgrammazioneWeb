import dayjs from 'dayjs';

export const INITIAL_FILMS = [
  { id: 1, title: 'Pulp Fiction', favorite: true, date: dayjs('2026-03-10'), rating: 5 },
  { id: 2, title: '21 Grams', favorite: true, date: dayjs('2026-02-15'), rating: 4 },
  { id: 3, title: 'Star Wars', favorite: false, date: null, rating: 0 },
  { id: 4, title: 'Matrix', favorite: false, date: dayjs('2026-03-25'), rating: 5 },
  { id: 5, title: 'Shrek', favorite: true, date: dayjs('2026-03-20'), rating: 3 },
];