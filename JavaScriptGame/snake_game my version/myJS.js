var FIELD_SIZE_X = 30;
var FIELD_SIZE_Y = 40;
var SNAKE_SPEED = 250;
var snake = [];
var direction = 'y+';
var snake_timer;
var food_timer;
var score = 0;
var gameIsRunning = false;

function init() {
    prepareGameField();

    var wrap = document.getElementsByClassName('wrap')[0];
    wrap.style.width = '600px';

    document.getElementById('snake_start').addEventListener('click', startGame);
    document.getElementById('snake_renew').addEventListener('click', refreshGame);

    window.addEventListener('keydown', changeDirection);
}

function prepareGameField() {
    var game_table = document.createElement('table');
    game_table.setAttribute('class', 'game-table');

    for (var i = 0; i < FIELD_SIZE_X; i++) {
        var row = document.createElement('tr');
        row.className = 'game-table-row row-' + i;

        for (var j = 0; j < FIELD_SIZE_Y; j++) {
            var cell = document.createElement('td');
            cell.className = 'game-table-cell cell-' + i + '-' + j;

            row.appendChild(cell);
        }
        game_table.appendChild(row);
    }
    document.getElementById('snake-field').appendChild(game_table);
}

function startGame() {
    gameIsRunning = true;
    respawn();

    snake_timer = setInterval(move, SNAKE_SPEED);
    food_timer = setInterval(createFood, 5000);
}


function respawn() {
    var start_coord_x = Math.floor(FIELD_SIZE_X / 2);
    var start_coord_y = Math.floor(FIELD_SIZE_Y / 2);

    var snake_head = document.querySelector('.cell-' + start_coord_y + '-' + start_coord_x);
    snake_head.classList.add('snake-unit');

    var snake_tail = document.querySelector('.cell-' + start_coord_y + '-' + (start_coord_x - 1));
    snake_tail.classList.add('snake-unit');

    snake.push(snake_head);
    snake.push(snake_tail);
}

function move() {
    // Логируем направление для отладки
    console.log("move", direction);

    // Получаем классы головы змейки
    var snake_head_classes = snake[snake.length - 1].getAttribute("class").split(" ");
    
    // Получаем координаты головы змейки
    var snake_coords = snake_head_classes[1].split('-');
    var coord_y = parseInt(snake_coords[1]);
    var coord_x = parseInt(snake_coords[2]);

    // Определяем новую позицию для головы в зависимости от направления
    var new_unit;
    if (direction == 'x-') {
        new_unit = document.getElementsByClassName('cell-' + coord_y + '-' + (coord_x - 1))[0];
    } else if (direction == 'x+') {
        new_unit = document.getElementsByClassName('cell-' + coord_y + '-' + (coord_x + 1))[0];
    } else if (direction == 'y+') {
        new_unit = document.getElementsByClassName('cell-' + (coord_y - 1) + '-' + coord_x)[0];
    } else if (direction == 'y-') {
        new_unit = document.getElementsByClassName('cell-' + (coord_y + 1) + '-' + coord_x)[0];
    }

    // Проверка: новая ячейка не должна быть частью змейки и не должна выходить за границы поля
    if (!isSnakeUnit(new_unit) && new_unit !== undefined) {
        // Добавляем новую часть змейки
        new_unit.setAttribute('class', new_unit.getAttribute('class') + ' snake-unit');
        snake.push(new_unit);

        // Проверяем, если змейка не съела еду, удаляем хвост
        if (!haveFood(new_unit)) {
            // Находим хвост змейки
            var removed = snake.splice(0, 1)[0];
            var classes = removed.getAttribute('class').split(' ');

            // Удаляем класс хвоста
            removed.setAttribute('class', classes[0] + ' ' + classes[1]);
        }
    } else {
        // Игра заканчивается, если змейка сталкивается с собой или выходит за границы
        finishTheGame();
    }
}


function isSnakeUnit(unit) {
    var check = false;
    
    // Проверка, что змейка включает данную ячейку
    if (snake.includes(unit)) {
        check = true;
    }

    return check;
}

function haveFood(unit) {
    var check = false;
    
    // Получение классов ячейки
    var unit_classes = unit.getAttribute('class').split(' ');
    
    // Проверка, есть ли в ячейке еда
    if (unit_classes.includes('food-unit')) {
        check = true;
        
        // Создание новой еды
        createFood();
        
        // Увеличение счёта
        score++;

        // Увеличение скорости змейки
        increaseSpeed();
    }

    return check;
}

function increaseSpeed() {
    // Уменьшаем задержку для увеличения скорости
    if (SNAKE_SPEED > 50) { // Ограничиваем минимальную скорость
        SNAKE_SPEED -= 20; // Уменьшаем таймер на 20 мс
    }

    // Останавливаем старый таймер и запускаем новый с обновленной скоростью
    clearInterval(snake_timer);
    snake_timer = setInterval(move, SNAKE_SPEED);
}


function createFood() {
    // Проверка, есть ли уже яблоко на поле
    var existingFood = document.getElementsByClassName('food-unit');
    
    if (existingFood.length > 0) {
        return;
    }
    
    var foodCreated = false;
    while (!foodCreated) {
        // Генерация случайных координат еды
        var food_x = Math.floor(Math.random() * FIELD_SIZE_X);
        var food_y = Math.floor(Math.random() * FIELD_SIZE_Y);

        // Получение элемента ячейки поля по сгенерированным координатам
        var food_cell = document.getElementsByClassName('cell-' + food_y + '-' + food_x)[0];
        
        if (food_cell) {
            var food_cell_classes = food_cell.getAttribute('class').split(' ');

            // Проверка, что еда не появится на змейке
            if (!food_cell_classes.includes('snake-unit')) {
                // Добавление класса еды
                food_cell.setAttribute('class', food_cell.getAttribute('class') + ' food-unit');
                foodCreated = true; // Выход из цикла
            }
        }
    }
}


function changeDirection(e) {
    console.log(e);
    switch (e.keyCode) {
        case 37: // Клавиша влево
            if (direction != 'x+') {
                direction = 'x-';
            }
            break;
        case 38: // Клавиша вверх
            if (direction != 'y-') {
                direction = 'y+';
            }
            break;
        case 39: // Клавиша вправо
            if (direction != 'x-') {
                direction = 'x+';
            }
            break;
        case 40: // Клавиша вниз
            if (direction != 'y+') {
                direction = 'y-';
            }
            break;
    }
}


function finishTheGame() {
    gameIsRunning = false;
    clearInterval(snake_timer);
    clearInterval(food_timer);
    alert('Game Over! Score: ' + score);
}

function refreshGame() {
    location.reload();
}

window.onload = init;
