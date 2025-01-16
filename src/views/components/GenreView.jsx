import style11 from './GenreView.module.css';

function GenreView({ genresList, onGenreClick }) {
  const genresArray = genresList instanceof Map ? Array.from(genresList.entries()) : genresList;

  return (
    <div className={style11.genretag}>
      {genresArray.map(([id, name]) => (
        <ul key={id}>
          <li onClick={() => onGenreClick(id)}>
            {name}
          </li>
        </ul>
      ))}
    </div>
  );
}

export default GenreView;
