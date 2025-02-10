from django.urls import path
from .views import RestauranteView, AvaliacaoView, RankingView

urlpatterns = [
    path('restaurantes/', RestauranteView.as_view(), name='restaurante-list'),
    path('avaliacoes/', AvaliacaoView.as_view(), name='avaliacao-list'),
    path('ranking/', RankingView.as_view(), name='ranking-list'),
]