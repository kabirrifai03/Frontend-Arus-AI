import React from "react";

interface HeaderProps {
  name: string;
}

const Header: React.FC<HeaderProps> = ({ name }) => {
  
  return (
    <header className="bg-white p-6 shadow-md">
      <h1 className="text-xl font-bold text-gray-800">
        Selamat Datang {name } 👋
      </h1>
    </header>
  );
};

export default Header;
