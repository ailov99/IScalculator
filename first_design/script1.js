function setup() {
	// Get all keys
	var keys = document.querySelectorAll('#calculator span');
	var operators = ['!', 'log', '(', ')', '^', 'sin', '÷', 'cos', '*', 'tan', '-', 'pi', '=', '+'];
	var decAdded = false;

	// Hook onclick events to all keys
	for (var i = 0; i < keys.length; i++) {
		keys[i].onclick = function(e) {
			// get input and button values
			var input = document.querySelector('.screen');
			var inputVal = input.innerHTML;
			var btnVal = this.innerHTML;

			// erase on CE press
			if (btnVal == 'CE') {
				input.innerHTML = '';
				decAdded = false;
			}
			// eval key press
			else if (btnVal == '=') {
				var eq = inputVal;
				var last = eq[eq.length - 1];
				// set up string for math lib parsing
				//eq = eq.replace();                    //TODO

				// remove last char if its not a digit
				if (operators.indexOf(last) > -1 || last == '.')
					eq = eq.replace(/.$/, '');
				
				if (eq)
					input.innerHTML = eval(eq);

				decAdded = false;
			}
			// operator press
			else if (operators.indexOf(btnVal) > -1) {
				// only add to string if its valid so far
				var last = inputVal[inputVal.length - 1];
				if (inputVal != '' && operators.indexOf(last) == -1)
					input.innerHTML += btnVal;
				// '-' is allowed
				else if (inputVal == '' && btnVal == '-')
					input.innerHTML += btnVal;

				// if last char of string was another operator -> replace it
				if (operators.indexOf(last) > -1 && inputVal.length > 1)
					input.innerHTML = inputVal.replace(/.$/, btnVal);

				decAdded = false;
			}
			// prevent multiple decimals
			else if (btnVal == '.') {
				if (!decAdded) {
					input.innerHTML += btnVal;
					decAdded = true;
				}
			}
			// some other key was pressed
			else {
				input.innerHTML += btnVal;
			}
			// no page jumps
			e.preventDefault();
		}
	}
}

window.onload = setup;
