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
        this.selectedOption = null;
        
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
        this.selectedOption = null;
        
        if (this.option1Button && this.option2Button && this.optionSelector) {
            this.option1Button.textContent = option1Text;
            this.option2Button.textContent = option2Text;
            this.optionSelector.style.display = 'flex';
        
            this.option1Button.classList.remove('selected');
            this.option2Button.classList.remove('selected');
            
            this.optionCallback = callback;
        }
    }
    
    hideOptions() {
        if (this.optionSelector) {
            this.optionSelector.style.display = 'none';
        }
        this.optionsMode = false;
        this.selectedOption = null;
        
        if (this.option1Button && this.option2Button) {
            this.option1Button.classList.remove('selected');
            this.option2Button.classList.remove('selected');
        }
    }
    
    selectOption(optionNumber) {
        if (!this.optionsMode) return;
        
        this.selectedOption = optionNumber;
    
        if (optionNumber === 1) {
            this.option1Button.classList.add('selected');
            this.option2Button.classList.remove('selected');
        } else if (optionNumber === 2) {
            this.option2Button.classList.add('selected');
            this.option1Button.classList.remove('selected');
        }
    }
    
    confirmOption() {
        if (!this.optionsMode || this.selectedOption === null) return;
        
        if (this.optionCallback) {
            this.optionCallback(this.selectedOption);
            this.hideOptions();
        }
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
        
        if (this.option1Button) {
            this.option1Button.addEventListener('click', () => {
                this.selectOption(1);
            });
        }
        
        if (this.option2Button) {
            this.option2Button.addEventListener('click', () => {
                this.selectOption(2);
            });
        }
        
        document.addEventListener('keydown', (e) => {
            if (this.optionsMode) {
                if (e.key === '1') {
                    this.selectOption(1);
                } else if (e.key === '2') {
                    this.selectOption(2);
                } else if (e.key === 'Enter') {
                    this.confirmOption();
                }
            }
        });
        
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
