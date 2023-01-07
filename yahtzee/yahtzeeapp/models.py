from django.contrib.auth.models import User
from django.db import models


class Board(models.Model):
    user = models.ForeignKey(User, verbose_name='Користувач', on_delete=models.CASCADE)
    players = models.JSONField()
    board = models.JSONField()
    moves = models.JSONField()


class GameHistory(models.Model):
    game_id = models.IntegerField(unique=True)
    user = models.ForeignKey(User, verbose_name='Користувач', on_delete=models.CASCADE)
    players = models.JSONField()
    board = models.JSONField()
    win_player = models.CharField(max_length=100, verbose_name='Переможець')
    win_score = models.IntegerField(verbose_name='Рахунок')
    data = models.DateField(auto_now_add=True)
