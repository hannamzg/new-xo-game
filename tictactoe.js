
class TicTacToe {
    constructor() {
        this.cells = document.querySelectorAll('[data-cell]');
        this.message = document.getElementById('alert');
        this.messageCounter = document.getElementById('messageCounter');
        this.closeIcon = document.getElementById('btn-close');
        this.resetButton = document.getElementById('reset');
        this.sizeChoices = document.querySelectorAll('.size-choices input[type="radio"]');
        this.currentPlayerH2 = document.getElementById("currentPlayer");

        this.currentPlayer = 'X';
        this.currentPlayerH2.textContent = "Current player " + this.currentPlayer;
        this.gameBoard = ['', '', '', '', '', '', '', '', ''];
        this.gameActive = true;

        this.sizeSelections = {
            'X': { 'small': 2, 'medium': 2, 'big': 2 },
            'O': { 'small': 2, 'medium': 2, 'big': 2 }
        };

        this.winCombinations = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        this.handleCellClick = (e) => {
            const cell = e.target;
            const index = cell.getAttribute('data-cell');

            let size = this.getSelectedSizes(this.currentPlayer);

            if (size === null) {
                this.messageCounter.style.display = "flex";
                this.message.textContent = 'You should choose a size';
                return;
            }

            if (!this.checkOfCanChangeIt(cell.getAttribute('data-size'), size)) {
                this.messageCounter.style.display = "flex";
                this.message.textContent = 'not-allowed';
                return;
            }

            cell.setAttribute('data-size', size);

            this.gameBoard[index] = this.currentPlayer;
            cell.textContent = this.currentPlayer;
            cell.style.cursor = 'not-allowed';

            this.sizeSelections[this.currentPlayer][size]--;

            if (this.sizeSelections[this.currentPlayer][size] === 0) {
                this.disableSizeRadioButtons(this.currentPlayer, size);
            }

            this.checkWinner();

            this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
            this.currentPlayerH2.textContent = "Current player " + this.currentPlayer;
            if (!this.gameActive) {
                this.cells.forEach((cell) => {
                    cell.removeEventListener('click', this.handleCellClick);
                });
            }
        };

        this.resetGame = () => {
            const sizeRadios = document.querySelectorAll('.size-choices input[type="radio"]');
            sizeRadios[0].checked = true;
            sizeRadios[3].checked = true;

            sizeRadios.forEach((radio) => {
                radio.disabled = false;
            });
            this.gameBoard = ['', '', '', '', '', '', '', '', ''];
            this.currentPlayer = 'X';
            this.currentPlayerH2.textContent = "Current player " + this.currentPlayer;
            this.gameActive = true;
            this.message.textContent = '';
            this.enableSizeRadioButtons();
            this.cells.forEach((cell) => {
                cell.textContent = '';
                cell.style.cursor = 'pointer';
                cell.addEventListener('click', this.handleCellClick);
            });
            this.sizeSelections = {
                'X': { 'small': 2, 'medium': 2, 'big': 2 },
                'O': { 'small': 2, 'medium': 2, 'big': 2 }
            };
        };
    }

    checkWinner() {
        for (const combination of this.winCombinations) {
            const [a, b, c] = combination;
            if (this.gameBoard[a] && this.gameBoard[a] === this.gameBoard[b] && this.gameBoard[a] === this.gameBoard[c]) {
                this.gameActive = false;
                this.messageCounter.style.display = "flex";
                this.message.textContent = `${this.currentPlayer} wins!`;
            }
        }
        if (!this.gameBoard.includes('') && this.gameActive) {
            this.gameActive = false;
            this.messageCounter.style.display = "flex";
            this.message.textContent = "It's a draw!";
        }
    }

    getSelectedSizes(player) {
        const sizeCheckboxes = document.querySelectorAll(`.size${player}:checked`);
        if (sizeCheckboxes.length === 1) {
            return sizeCheckboxes[0].value;
        }
        return null;
    }

    checkOfCanChangeIt(currentSize, chosenSize) {
        if (currentSize == null) {
            return true;
        }
        switch (currentSize) {
            case "small":
                if (chosenSize === "medium" || chosenSize === "big") {
                    return true;
                }
                break;
            case "medium":
                if (chosenSize === "big") {
                    return true;
                }
                break;
            case "big":
                return false;
            default:
                return true;
        }
    }

    disableSizeRadioButtons(player, size) {
        const sizeRadios = document.querySelectorAll(`.size${player}[value="${size}"]`);
        sizeRadios.forEach((radio) => {
            radio.disabled = true;
        });
    }

    enableSizeRadioButtons() {
        const sizeRadios = document.querySelectorAll('.size-choices input[type="radio"]');
        sizeRadios.forEach((radio) => {
            radio.disabled = false;
        });
    }
}

const ticTacToe = new TicTacToe();

ticTacToe.cells.forEach((cell) => {
    cell.addEventListener('click', () => ticTacToe.handleCellClick());
});

ticTacToe.resetButton.addEventListener('click', () => ticTacToe.resetGame());
ticTacToe.closeIcon.addEventListener('click', () => {
    ticTacToe.messageCounter.style.display = 'none';
});
