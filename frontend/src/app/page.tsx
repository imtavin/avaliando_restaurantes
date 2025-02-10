"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="page-container">
      <div className="form-container">
        <h1 className="form-title">Bem-vindo ao FoodRank 🍽️</h1>
        <p className="form-description">
          O FoodRank é uma plataforma para avaliar e descobrir os melhores restaurantes. 
          Você pode cadastrar novos restaurantes, avaliar pratos e conferir o ranking dos melhores lugares da sua cidade.
        </p>

        <p className="form-description">
          Para começar, cadastre um restaurante clicando no botão abaixo:
        </p>

        <div className="form-buttons">
          <button onClick={() => router.push("/cadastro")} className="btn-primary">
            Cadastrar Restaurante
          </button>
        </div>
      </div>
    </div>
  );
}
