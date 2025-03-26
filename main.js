const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
    constructor(field) {
        this.field = field.map(row => row.split(''));
        this.playerPos = [0, 0];
        this.gameOver = false;
        this.height = field.length;
        this.width = field[0].length;
    }

    static generateField(height, width, holePercentage = 0.2) {
        const field = Array(height).fill().map(() =>
            Array(width).fill(fieldCharacter)
        );

        let hatRow, hatCol;
        do {
            hatRow = Math.floor(Math.random() * height);
            hatCol = Math.floor(Math.random() * width);
        } while (hatRow === 0 && hatCol === 0);
        field[hatRow][hatCol] = hat;

        const totalCells = height * width;
        const numHoles = Math.floor(totalCells * holePercentage);

        let holesPlaced = 0;
        while (holesPlaced < numHoles) {
            const row = Math.floor(Math.random() * height);
            const col = Math.floor(Math.random() * width);
            if (!(row === 0 && col === 0) &&
                !(row === hatRow && col === hatCol) &&
                field[row][col] === fieldCharacter) {
                field[row][col] = hole;
                holesPlaced++;
            }
        }

        return field.map(row => row.join(''));
    }

    print() {
        return this.field.map(row => row.join('')).join('\n');
    }

    move(direction) {
        // Mark current position unless it's the hat
        const currentChar = this.field[this.playerPos[0]][this.playerPos[1]];
        if (currentChar !== hat) {
            this.field[this.playerPos[0]][this.playerPos[1]] = pathCharacter;
        }

        // Calculate new position
        let newRow = this.playerPos[0];
        let newCol = this.playerPos[1];

        switch(direction.toLowerCase()) {
            case 'u':
                newRow--;
                break;
            case 'd':
                newRow++;
                break;
            case 'l':
                newCol--;
                break;
            case 'r':
                newCol++;
                break;
            default:
                console.log('Invalid direction! Use u (up), d (down), l (left), or r (right)');
                return;
        }

        // Check boundaries first
        if (newRow < 0 || newRow >= this.height || newCol < 0 || newCol >= this.width) {
            console.log('Game Over! You moved outside the field.');
            this.gameOver = true;
            return;
        }

        // Update position and check new location
        this.playerPos = [newRow, newCol];
        const newPosition = this.field[newRow][newCol];

        if (newPosition === hat) {
            console.log('Congratulations! You found your hat!');
            this.gameOver = true;
        } else if (newPosition === hole) {
            console.log('Game Over! You fell into a hole!');
            this.gameOver = true;
        }
    }

    playGame() {
        while (!this.gameOver) {
            console.log(this.print());
            const direction = prompt('Which direction? (u/d/l/r): ');
            this.move(direction);
            console.log('\n');
        }
        console.log(this.print());
    }
}

const randomField = Field.generateField(5, 5, 0.2);
const game = new Field(randomField);
game.playGame();