
import React from 'react';
import { Link } from 'react-router-dom';

const Logo: React.FC = () => {
  return (
    <Link to="/" className="text-2xl font-bold text-purple-light">
      people.ai
    </Link>
  );
};

export default Logo;
