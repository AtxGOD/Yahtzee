from django.contrib.auth import logout
from django.contrib.auth.models import User
from django.db import IntegrityError
from rest_framework import generics, permissions
from rest_framework.decorators import permission_classes, api_view
from rest_framework.exceptions import ValidationError
from rest_framework.views import APIView
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny

from .models import Board
from .serializers import BoardSerializer, RegisterSerializer, UserSerializer
from .permissions import IsOwner
from .game import create_board, sum_board


class GetBoard(generics.ListCreateAPIView):
    queryset = Board.objects.all()
    serializer_class = BoardSerializer
    permission_classes = (IsAuthenticated, )

    def get_queryset(self):
        return Board.objects.filter(user=self.request.user)

    def get(self, request, *args, **kwargs):
        data = self.list(request, *args, **kwargs)
        if data.data:
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
    permission_classes = (IsOwner, IsAuthenticated)

    def patch(self, request, *args, **kwargs):
        data = self.partial_update(request, *args, **kwargs)
        data.data = sum_board(data.data)
        return data


from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token


class CustomAuthToken(ObtainAuthToken):
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                            context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'email': user.email
        })


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_logout(request):

    request.user.auth_token.delete()

    logout(request)

    return Response('User Logged out successfully')


# Register API
class RegisterAPI(generics.GenericAPIView):
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        print(user)
        return Response({
        "user": UserSerializer(user, context=self.get_serializer_context()).data
        })


def index(request):
    return render(request, "yahtzeeapp/base.html")


