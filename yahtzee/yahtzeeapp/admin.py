from django.contrib import admin

from .models import Board, GameHistory


class AdminBoard(admin.ModelAdmin):
    list_display = ('user', 'players', 'board', 'moves')


class AdminGameHistory(admin.ModelAdmin):
    list_display = ('user', 'win_player', 'win_score', 'data')


admin.site.register(Board, AdminBoard)
admin.site.register(GameHistory, AdminGameHistory)
