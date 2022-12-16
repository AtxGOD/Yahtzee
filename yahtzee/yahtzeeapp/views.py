from rest_framework import generics
from django.shortcuts import render
from rest_framework.response import Response

from .models import Board
from .serializers import BoardSerializer
from .permissions import IsOwner


class GetBoard(generics.ListCreateAPIView):
    queryset = Board.objects.all()
    serializer_class = BoardSerializer

    def get_queryset(self):
        return Board.objects.filter(user=self.request.user)

    def post(self, request, *args, **kwargs):
        return Response({"you": f"{request.user}"})


class UpdateBoard(generics.RetrieveUpdateAPIView):
    queryset = Board.objects.all()
    serializer_class = BoardSerializer
    permission_classes = (IsOwner, )



