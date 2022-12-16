from django.contrib import admin

from .models import Board


class AdminBoard(admin.ModelAdmin):
    list_display = ('user', 'players', 'board')


admin.site.register(Board, AdminBoard)
