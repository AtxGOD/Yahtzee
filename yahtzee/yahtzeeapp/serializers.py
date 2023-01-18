from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Board, GameHistory


class BoardSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Board
        fields = "__all__"


# User Serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')


# Register Serializer
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(validated_data['username'], validated_data['email'], validated_data['password'])

        return user


class SaveHistorySerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = GameHistory
        fields = ('game_id', 'user', 'players', 'board', 'win_player', 'win_score')


class TopHistorySerializer(serializers.ModelSerializer):

    class Meta:
        model = GameHistory
        fields = ('game_id', 'win_player', 'win_score')
