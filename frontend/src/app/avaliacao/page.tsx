"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";

interface Restaurante {
  id: number;
  nome: string;
}

export default function Avaliacao() {
  const searchParams = useSearchParams();
  const restauranteIdFromUrl = searchParams.get("restauranteId");
  const router = useRouter();
  const [restaurantes, setRestaurantes] = useState<Restaurante[]>([]);
  const [restauranteSelecionado, setRestauranteSelecionado] = useState<string>(restauranteIdFromUrl || "");
  const [nota, setNota] = useState<number>(1);
  const [comentario, setComentario] = useState<string>("");
  const [imagem, setImagem] = useState<File | null>(null);

  useEffect(() => {
    // Carregar restaurantes do backend
    axios
      .get(`${process.env.API_BASE_URL}/api/restaurantes/`)
      .then((response) => {
        console.log("Restaurantes:", response.data);
        if (Array.isArray(response.data)) {
          setRestaurantes(response.data);
        }
      })
      .catch((error) => {
        console.error("Erro ao buscar restaurantes:", error);
      });
  }, []);

  useEffect(() => {
    // Atualizar restaurante selecionado baseado na URL
    if (restauranteIdFromUrl) {
      setRestauranteSelecionado(restauranteIdFromUrl);
    }
  }, [restauranteIdFromUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
    const formData = new FormData();
    formData.append("restauranteSelecionado", restauranteSelecionado);
    formData.append("nota", nota.toString());
    formData.append("comentario", comentario);
    if (imagem) {
      formData.append("imagem", imagem);
    }
    
    console.log(formData.values)
    console.log("🔹 Enviando dados:", Object.fromEntries(formData));

    await axios.post(`${process.env.API_BASE_URL}/api/avaliacoes/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
      router.push(`/ranking`);
    } catch (error) {
      console.error("Erro ao enviar avaliação:", error);
      alert("Erro ao enviar avaliação.");
    }
  };

  return (
    <div className="page-container">
      <div className="form-container">
        <h1 className="form-title">Avaliação de Restaurante</h1>

        <form onSubmit={handleSubmit} className="form">
          {/* Seleção do Restaurante */}
          <div className="form-group">
            <label htmlFor="restaurante" className="form-label">
              Selecione um Restaurante
            </label>
            <select
              id="restaurante"
              value={restauranteSelecionado}
              onChange={(e) => setRestauranteSelecionado(e.target.value)}
              className={`form-select ${!restauranteSelecionado ? "input-error" : ""}`}
              required
            >
              <option value="" disabled>
                Escolha um restaurante
              </option>
              {restaurantes.map((restaurante) => (
                <option key={restaurante.id} value={restaurante.id}>
                  {restaurante.nome}
                </option>
              ))}
            </select>
            {!restauranteSelecionado && <p className="error-message">Selecione um restaurante.</p>}
          </div>

          {/* Nota */}
          <div className="form-group">
            <label htmlFor="nota" className="form-label">
              Nota (1-5)
            </label>
            <input
              id="nota"
              type="number"
              value={nota}
              onChange={(e) => setNota(Number(e.target.value))}
              className="form-input"
              min="1"
              max="5"
              required
            />
          </div>

          {/* Comentário */}
          <div className="form-group">
            <label htmlFor="comentario" className="form-label">
              Comentário
            </label>
            <textarea
              id="comentario"
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              className="form-textarea"
              placeholder="Descreva sua experiência"
              rows={4}
              required
            />
          </div>

          {/* Upload de Imagem */}
          <div className="form-group">
            <label htmlFor="imagem" className="form-label">
              Adicionar Imagem (opcional)
            </label>
            <input
              id="imagem"
              type="file"
              onChange={(e) => setImagem(e.target.files ? e.target.files[0] : null)}
              className="form-file"
            />
          </div>

          {/* Botões */}
          <div className="form-buttons">
            <button type="submit" className="btn-primary">
              Enviar Avaliação
            </button>
            <button onClick={() => {
              window.location.href = 'http://localhost:3000/cadastro';}} 
              type="button" className="btn-secondary">
              Voltar Cadastro
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
