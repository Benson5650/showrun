import json
import os


def save_seating_chart(filename):
    seating_chart = []
    print("請輸入座位表，每行用空格分隔，輸入空行結束：")
    while True:
        line = input()
        if line == "":
            break
        seating_chart.append(list(map(int, line.split())))
    
    with open(filename, 'w') as file:
        for row in seating_chart:
            file.write(' '.join(map(str, row)) + '\n')

def load_methods(filename):
    with open(filename, 'r') as file:
        return json.load(file)   

def load_seating_chart(filename):
    with open(filename, 'r') as file:
        seating_chart = [list(map(int, line.split())) for line in file]
    return seating_chart

def print_seating_chart(seating_chart):
    #對齊輸出
    max_width = len(str(max(map(max, seating_chart))))
    for row in seating_chart:
        print(' '.join(f'{num:>{max_width}}' for num in row))

def get_position(seating_chart, r, c, wrap_around):
    rows = len(seating_chart)
    cols = len(seating_chart[0])
    if wrap_around:
        r = r % rows
        c = c % cols
        return seating_chart[r][c]
    else:
        if 0 <= r < rows and 0 <= c < cols:
            return seating_chart[r][c]
        else:
            return None

def apply_method(seating_chart, number, method_name, methods):
    row, col = find_number(seating_chart, number)
    if row is None or col is None:
        return []  # 如果找不到座位號碼，返回空列表

    try:
        method = methods[method_name]
    except KeyError:
        return []  # 如果找不到方法，返回空列表

    wrap_around = method.get('wrap_around', False)
    directions = method.get('directions', [])
    
    if not isinstance(directions, list) or not all(isinstance(d, list) and len(d) == 2 for d in directions):
        return []  # 如果方向格式無效，返回空列表

    values = set()  # 使用集合來自動合併或刪除重複項
    for direction in directions:
        r, c = row - direction[1], col + direction[0]
        value = get_position(seating_chart, r, c, wrap_around)
        if value is not None:
            values.add(value)
    
    return sorted(values)  # 返回排序後的結果

def visualize_result(seating_chart, result):
    max_width = len(str(max(map(max, seating_chart))))
    for row in seating_chart:
        print(' '.join(f'{num:>{max_width}}' if num not in result else '*' * max_width for num in row))

def print_methods_code(methods):
    for index, method in enumerate(methods.keys()):
        print(f'{index + 1}: {method}')

def find_number(seating_chart, number):
    for row in range(len(seating_chart)):
        for col in range(len(seating_chart[0])):
            if seating_chart[row][col] == number:
                return (row, col)
    return None


# 使用範例
'''
 1  2  3  4  5
 6  7  8  9 10
11 12 13 14 15
16 17 18 19 20
21 22 23 24 25
26 27 28 29 30

'''
def main():
    filename = 'seating_chart.txt'
    methods_file = 'methods.json'

    seating_chart = load_seating_chart(filename)
    methods = load_methods(methods_file)

    # 為每個方法添加流水號
    method_codes = {str(index + 1): method for index, method in enumerate(methods.keys())}

    print("請輸入你的座號")
    user_number = int(input())
    print("是否需要更新座位表？(y/n)")
    update = input()
    if update == "y":
        save_seating_chart(filename)

    try:
        seating_chart = load_seating_chart(filename)
    except FileNotFoundError:
        print(f'File {filename} not found')
        save_seating_chart(filename)

    print_seating_chart(seating_chart)
    print_methods_code(methods)

    while True:
        os.system('cls' if os.name == 'nt' else 'clear')
        print_seating_chart(seating_chart)
        print_methods_code(methods)
        print("請輸入座位號碼和方法代號，用空格分隔，輸入空行結束")
        line = input()
        if line == "":
            break

        number, method_code = line.split()
        method_name = method_codes.get(method_code)
        if method_name is None:
            print(f"無效的方法代號: {method_code}")
            continue
        result = apply_method(seating_chart, int(number), method_name, methods)
        # 檢查user是否被選中
        visualize_result(seating_chart, result)
        print("result:", result)
        if user_number in result:
            print("恭喜你被選中了")
        else:
            print("你沒有被選中")
        print("按下Enter繼續")
        input()

if __name__ == '__main__':
    main()