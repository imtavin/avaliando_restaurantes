from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import base64
from .utils import conectar_sheets

# Conectar ao Google Sheets
restaurantes_sheet, avaliacoes_sheet = conectar_sheets()

class RestauranteView(APIView):
    def get(self, request, *args, **kwargs):
        """Retorna todos os restaurantes cadastrados."""
        try:
            restaurantes = restaurantes_sheet.get_all_records(head=2)  # Obtém todos os restaurantes
            return Response(restaurantes, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"Erro ao buscar restaurantes: {e}")
            return Response({"error": f"Erro ao buscar restaurantes: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request, *args, **kwargs):
        """Cadastra um novo restaurante, verificando se ele já existe."""
        try:
            print("Recebido:", request.data)
            nome = request.data.get("nome")
            latitude = request.data.get("latitude")
            longitude = request.data.get("longitude")

            # Verifica se o restaurante já existe
            restaurantes = restaurantes_sheet.get_all_records(head=2)
            for restaurante in restaurantes:
                if restaurante["nome"] == nome:
                    return Response({"message": "Restaurante já cadastrado."}, status=status.HTTP_200_OK)

            # Gerar um ID baseado no número de linhas
            novo_id = len(restaurantes) + 1

            # Adicionar na planilha
            restaurantes_sheet.append_row([novo_id, nome, latitude, longitude])

            return Response({"id": novo_id, "message": "Restaurante cadastrado com sucesso!"}, status=status.HTTP_201_CREATED)
        except Exception as e:
            print(f"Erro ao buscar restaurantes: {e}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AvaliacaoView(APIView):
    def post(self, request, *args, **kwargs):
        """Cadastra uma nova avaliação."""
        try:
            print("Dados recebido: ", request.data)
            print("Arquivos recebido: ", request.FILES)
            data = request.data
            restaurante_id = int(data.get("restauranteSelecionado", 0))
            nota = int(data.get("nota", 0))
            comentario = data.get("comentario", "")
            imagem = request.FILES.get("imagem")

            imagem_base64 = ""
            if imagem:
                imagem_base64 = base64.b64encode(imagem.read()).decode("utf-8")

            avaliacoes_sheet.append_row([restaurante_id, nota, comentario, imagem_base64], table_range="B2")

            # Inserir avaliação no Google Sheets
            # avaliacoes_sheet.append_row([restaurante_id, nota, comentario, imagem.name if imagem else ""])

            return Response({"message": "Avaliação cadastrada com sucesso."}, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response(
                {"error": f"Erro ao cadastrar avaliação: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class RankingView(APIView):
    def get(self, request, *args, **kwargs):
        try:
            # Obtém todas as avaliações
            avaliacoes = avaliacoes_sheet.get_all_records(head=2)
            restaurantes = restaurantes_sheet.get_all_records(head=2)

            # Dicionário para armazenar dados agregados
            restaurante_data = {}

            # Calcula a soma das notas e o número de avaliações por restaurante
            for avaliacao in avaliacoes:
                restaurante_id = avaliacao["Restaurante ID"]
                nota = int(avaliacao["Nota"])

                if restaurante_id not in restaurante_data:
                    restaurante_data[restaurante_id] = {"soma_notas": 0, "qtd_avaliacoes": 0}

                restaurante_data[restaurante_id]["soma_notas"] += nota
                restaurante_data[restaurante_id]["qtd_avaliacoes"] += 1

            # Calcula a média e cria a lista de ranking
            ranking = []
            for restaurante_id, data in restaurante_data.items():
                media = data["soma_notas"] / data["qtd_avaliacoes"]
                nome = next(
                    (r["nome"] for r in restaurantes if r["id"] == restaurante_id), "Desconhecido"
                )
                ranking.append({
                    "id": restaurante_id,
                    "nome": nome,
                    "mediaNota": media,
                    "qtdAvaliacoes": data["qtd_avaliacoes"]
                })

            # Ordena por nota média (decrescente) e, em seguida, por número de avaliações
            ranking.sort(key=lambda x: (-x["mediaNota"], -x["qtdAvaliacoes"]))

            return Response(ranking, status=status.HTTP_200_OK)

        except Exception as e:
            print(f"Erro ao gerar o ranking: {e}")
            return Response(
                {"error": f"Erro ao gerar o ranking: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )