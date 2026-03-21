import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="brand">
          Carpet SaaS
        </Link>

        <nav className="nav">
          <Link to="/order" className="nav__link">
            Narudžba
          </Link>
          {/* <Link to="/invite" className="nav__link">
            Prijava radnika
          </Link> */}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;