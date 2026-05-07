import React from 'react';

const MainPage = () => {
  return (
    <div className="dashboard-layout">
      <nav className="sidebar">
        <h2>Banco Alimentar</h2>
        <ul style={{listStyle: 'none', padding: 0, marginTop: '2rem'}}>
          <li style={{margin: '1rem 0'}}>📦 Inventario</li>
          <li style={{margin: '1rem 0'}}>🍎 Donaciones</li>
          <li style={{margin: '1rem 0'}}>👥 Voluntarios</li>
        </ul>
      </nav>

      <main className="main-view">
        <header>
          <h1>Panel de Control</h1>
          <p>Bienvenido al sistema de gestión de excedentes.</p>
        </header>

        <section className="inventory-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '2rem'}}>
          <div className="card-alimento">
            <h3>Granos</h3>
            <p>150 kg disponibles</p>
          </div>
          <div className="card-alimento">
            <h3>Perecederos</h3>
            <p>12 kg por vencer</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default MainPage;