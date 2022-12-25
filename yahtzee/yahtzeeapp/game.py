combinations = ['1', '2', '3', '4', '5', '6', 'Школа', 'Пара', '2 пари', 'Сет', 'М. стріт',
                'В. стріт', 'Пар', 'Нечет', 'Фул хаус', 'Каре', 'Сміття', 'Яцзи', 'Сума']


def create_board(players):
    return {combination: [""] * len(players) for combination in combinations}


def sum_board(data):
    for i in range(len(data['players']['players'])):
        school_sum = 0
        total_sum = 0

        for comb in data['board']:
            if comb not in ['Школа', 'Сума'] and data['board'][comb][i] != '':
                if comb in combinations[:6]:
                    school_sum += int(data['board'][comb][i])
                total_sum += int(data['board'][comb][i])

        if school_sum >= 63:
            school_sum += 50
            total_sum += 50

        data['board']['Школа'][i] = str(school_sum)
        data['board']['Сума'][i] = str(total_sum)

    return data
