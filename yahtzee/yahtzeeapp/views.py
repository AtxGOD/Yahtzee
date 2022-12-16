from rest_framework import generics
from django.shortcuts import render
from rest_framework.response import Response

from .models import Board
from .serializers import BoardSerializer
from .permissions import IsOwner


class GetBoard(generics.ListCreateAPIView):
    queryset = Board.objects.all()
    serializer_class = BoardSerializer
    # permission_classes = (IsOwner, )

    def get(self, request, *args, **kwargs):
        print(request.user)
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return Response({"you": f"{request.user}"})

