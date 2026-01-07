        const canvas = document.getElementById("gameCanvas");
        const ctx = canvas.getContext("2d");
        const boxSize = 20; 
        const isMobile = /Mobi|Android/i.test(navigator.userAgent);

        // Premium Palette
        const colorSnakeHead = '#4B3832'; // Coffee
        const colorSnakeBody = '#FFDAB9'; // Peach
        const colorFood = '#E32929';      // IOTREND Red

        // Responsive canvas size logic
        let canvasSize = isMobile
            ? Math.min(window.innerWidth - 40, window.innerHeight * 0.4) 
            : 400; 
        
        // Snap to grid
        canvas.width = Math.floor(canvasSize / boxSize) * boxSize;
        canvas.height = Math.floor(canvasSize / boxSize) * boxSize;
        const gridSize = canvas.width / boxSize;

        let snake, direction, food, score, gameInterval;
        const gameOverModal = document.getElementById("game-over-modal");
        const modalScoreText = document.getElementById("modal-score-text");

        function initializeGame() {
            snake = [{ x: Math.floor(gridSize/2), y: Math.floor(gridSize/2) }];
            direction = { x: 0, y: 0 };
            food = generateFood();
            score = 0;
            document.getElementById("score").innerText = "Score: " + score;
            
            gameOverModal.classList.remove('active');
            clearInterval(gameInterval);
            gameInterval = null; 
            drawGame();
        }

        // Controls
        document.addEventListener("keydown", (event) => {
            if (event.key === "ArrowUp" && direction.y === 0) direction = { x: 0, y: -1 };
            if (event.key === "ArrowDown" && direction.y === 0) direction = { x: 0, y: 1 };
            if (event.key === "ArrowLeft" && direction.x === 0) direction = { x: -1, y: 0 };
            if (event.key === "ArrowRight" && direction.x === 0) direction = { x: 1, y: 0 };
            
            if (!gameInterval && (direction.x !== 0 || direction.y !== 0)) startGame();
        });

        // Touch handlers (mapped to your logic)
        const setupTouch = (id, dx, dy) => {
            document.getElementById(id).addEventListener("click", (e) => {
                e.preventDefault();
                if ((dx !== 0 && direction.x === 0) || (dy !== 0 && direction.y === 0)) {
                    direction = { x: dx, y: dy };
                    if (!gameInterval) startGame();
                }
            });
        };

        setupTouch("up", 0, -1);
        setupTouch("down", 0, 1);
        setupTouch("left", -1, 0);
        setupTouch("right", 1, 0);

        function startGame() {
            if (gameInterval) return;
            gameInterval = setInterval(gameLoop, 120);
        }

        function gameLoop() {
            const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

            // Collision Detection
            if (
                head.x < 0 || head.x >= gridSize || 
                head.y < 0 || head.y >= gridSize ||
                snake.some((segment) => segment.x === head.x && segment.y === head.y)
            ) {
                endGame();
                return;
            }

            snake.unshift(head);

            if (head.x === food.x && head.y === food.y) {
                score++;
                document.getElementById("score").innerText = "Score: " + score;
                food = generateFood();
            } else {
                snake.pop();
            }

            drawGame();
        }

        function endGame() {
            clearInterval(gameInterval);
            gameInterval = null;
            modalScoreText.innerText = "Your score: " + score;
            gameOverModal.classList.add('active');
        }

        function generateFood() {
            let foodPosition;
            do {
                foodPosition = {
                    x: Math.floor(Math.random() * gridSize),
                    y: Math.floor(Math.random() * gridSize),
                };
            } while (snake.some((segment) => segment.x === foodPosition.x && segment.y === foodPosition.y));
            return foodPosition;
        }

        function drawGame() {
            // Background clear
            ctx.fillStyle = "#fff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw food (Diamond Shape)
            ctx.fillStyle = colorFood;
            const fx = food.x * boxSize + boxSize/2;
            const fy = food.y * boxSize + boxSize/2;
            ctx.beginPath();
            ctx.moveTo(fx, fy - 7);
            ctx.lineTo(fx + 7, fy);
            ctx.lineTo(fx, fy + 7);
            ctx.lineTo(fx - 7, fy);
            ctx.closePath();
            ctx.fill();

            // Draw snake
            snake.forEach((segment, index) => {
                ctx.fillStyle = (index === 0) ? colorSnakeHead : colorSnakeBody;
                const r = 4; // Rounded corners
                const x = segment.x * boxSize + 1;
                const y = segment.y * boxSize + 1;
                const s = boxSize - 2;
                
                ctx.beginPath();
                if (ctx.roundRect) {
                    ctx.roundRect(x, y, s, s, r);
                } else {
                    ctx.rect(x, y, s, s);
                }
                ctx.fill();
            });
        }

        // Start
        initializeGame();
