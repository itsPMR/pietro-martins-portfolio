import { ArrowIcon } from "@/components/arrow-icon";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found">
      <p>404 / Página não encontrada</p>
      <h1>Esse caminho não faz parte do projeto.</h1>
      <Link className="button button-light" href="/">
        Voltar ao início
        <ArrowIcon direction="right" />
      </Link>
    </main>
  );
}
