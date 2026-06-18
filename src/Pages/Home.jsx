import React, { useState } from 'react';
import Hero from '../Components/Hero';
import Navbar from '../Components/NavBar';
import Footer from '../Components/Footer';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleNavSearch = (city) => {
    // Update search term to trigger Hero search.
    setSearchTerm(city);
  };

  // Reset search term after Hero processes it (optional, improves repeat searches).
  const handleHeroSearchProcessed = () => {
    setSearchTerm('');
  };

  return (
    <section>
      <Navbar onSearch={handleNavSearch} />
      <Hero searchTerm={searchTerm} onSearchProcessed={handleHeroSearchProcessed} />
      <Footer />
    </section>
  );
};

export default Home;