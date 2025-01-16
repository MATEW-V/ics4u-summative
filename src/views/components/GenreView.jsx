import style11 from './GenreView.module.css';

function GenreView({ genresList, onGenreClick }) {
  
  return (
    <div className={style11.genretag}>
      {genresList.map(([id, name]) => (
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
