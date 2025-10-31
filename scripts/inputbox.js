class InputBox {
    constructor() {
        this.mrBobOkButton = document.getElementById('mrBobOkButton');
        this.mrBobInputField = document.getElementById('mrBobInputField');
        this.mrBob = null;
        this.isInputFocused = false;
        
        this.setupEventListeners();
    }
    
    setMrBob(mrBob) {
        this.mrBob = mrBob;
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
