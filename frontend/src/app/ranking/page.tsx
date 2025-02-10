"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

interface Restaurante {
  id: number;
  nome: string;
  mediaNota: number;
  qtdAvaliacoes: number;
}

export default function Ranking() {
  const [ranking, setRanking] = useState<Restaurante[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const response = await axios.get(`${process.env.API_BASE_URL}/api/ranking/`);
        setRanking(response.data);
      } catch (err) {
        setError("Erro ao carregar ranking. Tente novamente.");
        console.error("Erro ao buscar ranking:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, []);

  return (
    <div className="page-container">
      <div className="form-container">
        <h1 className="form-title">🏆 Ranking dos Restaurantes</h1>

        {loading ? (
          <p className="loading-text">Carregando...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <div className="table-container">
            <table className="ranking-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Restaurante</th>
                  <th>Nota Média</th>
                  <th>Avaliações</th>
                </tr>
              </thead>
              <tbody>
                {ranking.map((restaurante, index) => (
                  <tr key={restaurante.id}>
                    <td>{index + 1}º</td>
                    <td>{restaurante.nome}</td>
                    <td>{restaurante.mediaNota.toFixed(1)}</td>
                    <td>{restaurante.qtdAvaliacoes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <br></br>
        <button onClick={() => {
              window.location.href = 'http://localhost:3000/';}} 
              type="button" className="btn-secondary">
              Voltar Cadastro
        </button>
      </div>
    </div>
  );
}
