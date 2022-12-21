from rest_framework import generics
from django.shortcuts import render
from rest_framework.response import Response

from .models import Board
from .serializers import BoardSerializer
from .permissions import IsOwner
from .game import create_board, sum_board


class GetBoard(generics.ListCreateAPIView):
    queryset = Board.objects.all()
    serializer_class = BoardSerializer

    def get_queryset(self):
        return Board.objects.filter(user=self.request.user)

    def get(self, request, *args, **kwargs):
        data = self.list(request, *args, **kwargs)
        data.data[0] = sum_board(dict(data.data[0]))
        return data

    def post(self, request, *args, **kwargs):
        Board.objects.filter(user=self.request.user).delete()

        b = Board(user=self.request.user, players=request.data, board=create_board(request.data['players']),
                  moves={'moves': []})
        b.save()
        return Response({"you": f"{request.user}"})


class UpdateBoard(generics.RetrieveUpdateAPIView):
    queryset = Board.objects.all()
    serializer_class = BoardSerializer
    permission_classes = (IsOwner, )

    def patch(self, request, *args, **kwargs):
        data = self.partial_update(request, *args, **kwargs)
        data.data = sum_board(data.data)
        return data


def index(request):
    return render(request, "yahtzeeapp/base.html")


