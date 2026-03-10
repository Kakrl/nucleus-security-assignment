/**
 * Command Pattern Implementation
 * Senior Developer Insight: Using commands allows us to store the exact
 * state before and after an operation, making Undo/Redo deterministic.
 */
class CalculationCommand {
    constructor(execute, undoValue, redoValue) {
        this.execute = execute;
        this.undoValue = undoValue; // State before
        this.redoValue = redoValue; // State after
    }
}

class Calculator {
    constructor(previousTextElement, currentTextElement) {
        this.previousTextElement = previousTextElement;
        this.currentTextElement = currentTextElement;
        this.historyListElement = document.getElementById('history-list');
        
        // Command stacks for Undo/Redo
        this.historyStack = [];
        this.redoStack = [];
        this.persistentHistory = JSON.parse(localStorage.getItem('calc_history')) || [];
        
        this.clear();
        this.renderHistory();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.redoStack = []; // Reset redo on new action
    }

    delete() {
        if (this.currentOperand === '0') return;
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '') this.currentOperand = '0';
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        
        this.saveState(); // Capture for undo

        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number.toString();
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
    }

    // Logic for a toggle (Add a button [data-negate] in HTML)
    toggleSign() {
        this.saveState();
        if (this.currentOperand === '0') return;
        this.currentOperand = (parseFloat(this.currentOperand) * -1).toString();
        this.updateDisplay();
    }

    chooseOperation(operation) {
        this.saveState();
        if (this.currentOperand === '') return;
        
        // Immediate execution for square root
        if (operation === '√') {
            this.computeSingleArg('√');
            return;
        }

        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+': computation = prev + current; break;
            case '-': computation = prev - current; break;
            case '*': computation = prev * current; break;
            case '/': 
                if (current === 0) {
                    alert("Error: Division by Zero");
                    this.clear();
                    return;
                }
                computation = prev / current; 
                break;
            case '^': computation = Math.pow(prev, current); break;
            case '%': computation = (prev / 100) * current; break;
            default: return;
        }

        /** * SENIOR SOLUTION: Precision Snapping
         * 1. .toPrecision(12) handles the floating point noise.
         * 2. parseFloat() removes trailing zeros and unnecessary .000 decimals.
         */
        this.currentOperand = parseFloat(computation.toPrecision(12)).toString();
        
        const record = `${prev} ${this.operation} ${current} = ${this.currentOperand}`;
        this.saveToHistory(record);
        
        this.operation = undefined;
        this.previousOperand = '';
    }

    computeSingleArg(op) {
        if (op === '√') {
            const val = parseFloat(this.currentOperand);
            const result = Math.sqrt(val);
            this.saveToHistory(`√(${val}) = ${result}`);
            this.currentOperand = result;
        }
    }

    saveToHistory(entry) {
        this.persistentHistory.unshift(entry);
        if (this.persistentHistory.length > 20) this.persistentHistory.pop();
        localStorage.setItem('calc_history', JSON.stringify(this.persistentHistory));
        this.renderHistory();
    }

    renderHistory() {
        this.historyListElement.innerHTML = '';
        this.persistentHistory.forEach(item => {
            const li = document.createElement('li');
            li.innerText = item;
            this.historyListElement.appendChild(li);
        });
    }

    updateDisplay() {
        this.currentTextElement.innerText = this.currentOperand;
        if (this.operation != null) {
            this.previousTextElement.innerText = `${this.previousOperand} ${this.operation}`;
        } else {
            this.previousTextElement.innerText = '';
        }
    }

    exportHistory() {
        const blob = new Blob([this.persistentHistory.join('\n')], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'calc-history.txt';
        a.click();
    }

    saveState() {
        // Limits stack size to 50 to prevent memory leaks in long sessions
        if (this.historyStack.length > 50) this.historyStack.shift();
        
        this.historyStack.push({
            current: this.currentOperand,
            previous: this.previousOperand,
            operation: this.operation
        });
    }

    undo() {
        if (this.historyStack.length === 0) return;

        // Before reverting, save current state to redoStack
        this.redoStack.push({
            current: this.currentOperand,
            previous: this.previousOperand,
            operation: this.operation
        });

        const prevState = this.historyStack.pop();
        this.currentOperand = prevState.current;
        this.previousOperand = prevState.previous;
        this.operation = prevState.operation;
    }

    redo() {
        if (this.redoStack.length === 0) return;

        // Save current state back to history before redoing
        this.historyStack.push({
            current: this.currentOperand,
            previous: this.previousOperand,
            operation: this.operation
        });

        const nextState = this.redoStack.pop();
        this.currentOperand = nextState.current;
        this.previousOperand = nextState.previous;
        this.operation = nextState.operation;
    }

    negate() {
        this.saveState();
        if (this.currentOperand === '0') return;
        
        // Toggle negative sign using string manipulation to avoid float errors
        if (this.currentOperand.toString().startsWith('-')) {
            this.currentOperand = this.currentOperand.toString().substring(1);
        } else {
            this.currentOperand = '-' + this.currentOperand.toString();
        }
    }
}

// --- Initialization & Event Listeners ---
const calculator = new Calculator(
    document.querySelector('[data-previous-operand]'),
    document.querySelector('[data-current-operand]')
);

// Negate Button
document.querySelector('[data-negate]').addEventListener('click', () => {
    calculator.negate();
    calculator.updateDisplay();
});

// Undo Button
document.querySelector('[data-undo]').addEventListener('click', () => {
    calculator.undo();
    calculator.updateDisplay();
});

// Redo Button
document.querySelector('[data-redo]').addEventListener('click', () => {
    calculator.redo();
    calculator.updateDisplay();
});

// IMPORTANT: Update your existing number/operation listeners 
// to clear the Redo stack whenever a NEW action is taken.
document.querySelectorAll('[data-number]').forEach(button => {
    button.addEventListener('click', () => {
        calculator.saveState(); // Record state before change
        calculator.redoStack = []; // New input invalidates redo history
        calculator.appendNumber(button.innerText);
        calculator.updateDisplay();
    });
});

document.querySelectorAll('[data-operation]').forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.innerText);
        calculator.updateDisplay();
    });
});

document.querySelector('[data-equals]').addEventListener('click', () => {
    calculator.compute();
    calculator.updateDisplay();
});

document.querySelector('[data-all-clear]').addEventListener('click', () => {
    calculator.clear();
    calculator.updateDisplay();
});

document.querySelector('[data-delete]').addEventListener('click', () => {
    calculator.delete();
    calculator.updateDisplay();
});

document.getElementById('export-btn').addEventListener('click', () => {
    calculator.exportHistory();
});

document.getElementById('clear-history').addEventListener('click', () => {
    if (confirm("Clear all calculation history?")) {
        calculator.persistentHistory = [];
        localStorage.removeItem('calc_history');
        calculator.renderHistory();
    }
});

// Keyboard Support
window.addEventListener('keydown', e => {
    if ((e.key >= 0 && e.key <= 9) || e.key === '.') calculator.appendNumber(e.key);
    if (e.key === '=' || e.key === 'Enter') calculator.compute();
    if (e.key === 'Backspace') calculator.delete();
    if (e.key === 'Escape') calculator.clear();
    if (['+', '-', '*', '/'].includes(e.key)) calculator.chooseOperation(e.key);
    calculator.updateDisplay();
});