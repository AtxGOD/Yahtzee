from django.contrib.auth.models import User
from django.db import models


class Board(models.Model):
    user = models.ForeignKey(User, verbose_name='Користувач', on_delete=models.CASCADE)
    players = models.JSONField()
    board = models.JSONField()
    moves = models.JSONField()
