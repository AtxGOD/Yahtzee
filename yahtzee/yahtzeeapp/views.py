from rest_framework import generics
from django.shortcuts import render
from rest_framework.response import Response

from .models import Board
from .serializers import BoardSerializer
from .permissions import IsOwner
from .game import create_board


class GetBoard(generics.ListCreateAPIView):
    queryset = Board.objects.all()
    serializer_class = BoardSerializer

    def get_queryset(self):
        return Board.objects.filter(user=self.request.user)

    def post(self, request, *args, **kwargs):
        print(request.user)
        print(request.data)

        test = Board.objects.filter(user=self.request.user).delete()
        print(test)

        b = Board(user=self.request.user, players=request.data, board=create_board(request.data['players']))
        b.save()
        print(b)

        return Response({"you": f"{request.user}"})


class UpdateBoard(generics.RetrieveUpdateAPIView):
    queryset = Board.objects.all()
    serializer_class = BoardSerializer
    permission_classes = (IsOwner, )


def index(request):
    return render(request, "yahtzeeapp/base.html")


