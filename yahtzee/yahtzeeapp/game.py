combinations = ['1', '2', '3', '4', '5', '6', 'Школа', 'Пара', '2 пари', 'Сет', 'М. стріт',
                'В. стріт', 'Пар', 'Нечет', 'Фул хаус', 'Каре', 'Сміття', 'Яцзи', 'Сума']


def create_board(players):
    return {combination: [""] * len(players) for combination in combinations}


