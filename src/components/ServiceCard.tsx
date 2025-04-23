
import React from 'react';

interface ServiceCardProps {
  imageUrl: string;
  title: string;
  desc: string;
  onClick?: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ imageUrl, title, desc, onClick }) => (
  <div className="rounded-xl border-2 border-purple-light p-6 bg-[#111429] flex flex-col items-center transition-all hover:scale-105 duration-200 group" style={{ minWidth: 330 }}>
    <img
      src={imageUrl}
      alt={title}
      className="rounded-lg w-full h-40 object-cover object-center mb-4"
      style={{ maxWidth: 300, background: "#fff" }}
    />
    <h3 className="text-xl font-bold text-purple mt-2 text-center">{title}</h3>
    <p className="text-white/90 text-base mt-2 text-center mb-4">{desc}</p>
    <button
      className="mt-auto inline-block rounded-full bg-purple px-6 py-2 text-white font-semibold text-base transition-colors hover:bg-purple-dark focus:outline-none focus:ring-2 focus:ring-purple focus:ring-opacity-50"
      onClick={onClick}
    >
      Learn More
    </button>
  </div>
);

export default ServiceCard;
