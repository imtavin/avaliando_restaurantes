"use client";

import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <Link href="/">
          <Image src="/favicon.ico" alt="FoodRank Logo" width={32} height={32} />
        </Link>
      </div>
      <ul className="nav-links">
        <li><Link href="/cadastro">Cadastrar Restaurante</Link></li>
        <li><Link href="/avaliacao">Avaliar</Link></li>
        <li><Link href="/ranking">Ranking</Link></li>
      </ul>
    </nav>
  );
}
