import './Header.css';
import logo from './../../assets/img/logo_full.svg';

function Header({sendInputValue, isSearching, setModalState}){

  function handleSearchSubmit(e){

    if(e.key === "Enter" && e.target.value.trim() !== ""){
      sendInputValue(e.target.value);
      isSearching(true);
    }

  }

  function handleSearchState(e){

    if(e.target.value.trim() === ""){
      isSearching(false);
    }

  }

  return (
    <header className='topNav'>
      <img className='logo-scorex' src={logo} />
      <input type="text" placeholder="Introduce tu busqueda" onKeyDown={handleSearchSubmit} onChange={handleSearchState}/>
      <i className="fa-regular fa-user" onClick={() => setModalState(true)}></i>
    </header>
  )
}

export default Header;