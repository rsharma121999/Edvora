import React from 'react';
import '../styles/NavbarStyles.css';

function Navbar({ Name }) {
  return (
    <div className="Navbar">
      <p className="Logo">Edvora</p>
      <div className="user">
        <p className="Name">{Name}</p>
        <img src="man.jpeg" alt="user" height={60} width={60} />
      </div>
    </div>
  );
}

export default Navbar;
