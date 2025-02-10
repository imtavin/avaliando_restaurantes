"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIconRetina,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function CadastroRestaurante() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [localizacao, setLocalizacao] = useState({ lat: 0, lng: 0 });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.API_BASE_URL}/api/restaurantes/`, {
        nome,
        latitude: localizacao.lat,
        longitude: localizacao.lng,
      });

      router.push(`/avaliacao?restauranteId=${response.data.id}`);
    } catch (error) {
      console.error(error);
      alert("Erro ao cadastrar restaurante.");
    }
  };

  function LocationMarker() {
    useMapEvents({
      click(e) {
        setLocalizacao({ lat: e.latlng.lat, lng: e.latlng.lng });
      },
    });

    return localizacao.lat !== 0 && localizacao.lng !== 0 ? (
      <Marker position={[localizacao.lat, localizacao.lng]} />
    ) : null;
  }

  return (
    <div className="page-container">
      <div className="form-container">
        <h1 className="form-title">Cadastro de Restaurante</h1>

        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <div className="form-group">
              <label htmlFor="nome" className="form-label">
                Nome do Restaurante
              </label>
              <input
                id="nome"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="form-input"
                placeholder="Digite o nome do restaurante"
                required
              />
            </div>
          </div>
        
          <br></br>   
          <div className="form-section">
            <div className="form-group">
                <label htmlFor="nome" className="form-label">
                    Localização do Restaurante
                </label>
                <MapContainer
                center={[-25.44336, -49.28174]}
                zoom={13}
                className="map-container"
                >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                />
                <LocationMarker />
                </MapContainer>

                {localizacao.lat !== 0 && localizacao.lng !== 0 && (
                <p className="map-coordinates">
                    Localização selecionada: Latitude {localizacao.lat}, Longitude {localizacao.lng}
                </p>
                )}
            </div>
          </div>

          <br></br>

          <div className="form-buttons">
            <button type="submit" className="btn-primary">
              Cadastrar Restaurante
            </button>
            <button onClick={() => {
                window.location.href = '/avaliacao'; }}
                type="button" className="btn-secondary">
              Pular 
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
