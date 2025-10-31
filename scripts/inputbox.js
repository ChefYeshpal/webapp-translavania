class InputBox {
    constructor() {
        this.mrBobOkButton = document.getElementById('mrBobOkButton');
        this.mrBobInputField = document.getElementById('mrBobInputField');
        this.optionSelector = document.getElementById('optionSelector');
        this.option1Button = document.getElementById('option1');
        this.option2Button = document.getElementById('option2');
        this.mrBob = null;
        this.dragon = null;
        this.isInputFocused = false;
        this.optionsMode = false;
        
        this.setupEventListeners();
    }
    
    setMrBob(mrBob) {
        this.mrBob = mrBob;
    }
    
    setDragon(dragon) {
        this.dragon = dragon;
    }
    
    showOptions(option1Text, option2Text, callback) {
        this.hideInput();
        this.optionsMode = true;
        
        if (this.option1Button && this.option2Button && this.optionSelector) {
            this.option1Button.textContent = option1Text;
            this.option2Button.textContent = option2Text;
            this.optionSelector.style.display = 'flex';
            
            // Store callback for option selection
            this.optionCallback = callback;
        }
    }
    
    hideOptions() {
        if (this.optionSelector) {
            this.optionSelector.style.display = 'none';
        }
        this.optionsMode = false;
    }
    
    showInput() {
        const inputContainer = document.getElementById('mrBobInput');
        if (inputContainer) {
            inputContainer.style.display = 'flex';
        }
    }
    
    hideInput() {
        const inputContainer = document.getElementById('mrBobInput');
        if (inputContainer) {
            inputContainer.style.display = 'none';
        }
    }
    
    setupEventListeners() {
        this.mrBobOkButton.addEventListener('click', () => {
            if (this.mrBob) {
                this.mrBob.handleInputSubmit();
            }
        });
        
        this.mrBobInputField.addEventListener('keydown', (e) => {
            e.stopPropagation();
            
            if (e.key === 'Enter') {
                if (this.mrBob) {
                    this.mrBob.handleInputSubmit();
                }
            }
        });
        
        // Option button event listeners
        if (this.option1Button) {
            this.option1Button.addEventListener('click', () => {
                if (this.optionCallback) {
                    this.optionCallback(1);
                    this.hideOptions();
                }
            });
        }
        
        if (this.option2Button) {
            this.option2Button.addEventListener('click', () => {
                if (this.optionCallback) {
                    this.optionCallback(2);
                    this.hideOptions();
                }
            });
        }
        
        // Track when input is focused
        this.mrBobInputField.addEventListener('focus', () => {
            this.isInputFocused = true;
        });
        
        this.mrBobInputField.addEventListener('blur', () => {
            this.isInputFocused = false;
        });
    }
    
    isFocused() {
        return this.isInputFocused;
    }
}
