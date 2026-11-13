import TopBar from './TopBar';
import Navbar from './Navbar';

export default function Header({ onSearch, onBurger }) {
  return (
    <header className="header header-3">
      <div className="sticky-height" />
      <div className="header-wrapper">
        <TopBar />
        <Navbar onSearch={onSearch} onBurger={onBurger} />
      </div>
    </header>
  );
}
