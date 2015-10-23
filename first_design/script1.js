// get random integer in range
function randint(min, max) {
	return (Math.floor(Math.random() * (max - min + 1)) + min);
}

// get random element from list
function randelem(list) {
	return list[Math.floor(Math.random()*list.length)];
}

// Tasks setup
// templates
var tasks = [{text: "Calculate A + B", expr: "A + B"},
			 {text: "Find the D of E(A+B)", expr: "D(E(A+B))"}];
var arith_ops = ['^', '+' ,'-', '*'];
var funcs = ["sin", "cos", "tan", "log"];

// global user task currently in progress, contains:
// 1. Text to be displayed to user
// 2. Expression to be entered in calculator and solved
// 3. Correct answer of the expression for checking user's anser
var current_task;


// Generate a task for the user
function generate_task() {
	
	// get a random task template
	var task = randelem(tasks);

	// parse task depending on its template
	switch (tasks.indexOf(task)) {
	case 0: {
		// put random integers in
		var randint1 = randint(1, 999);
	    var randint2 = randint(1, 999);
		task.text = task.text.replace("A", randint1);
		task.text = task.text.replace("B", randint2);
		task.expr = task.expr.replace("A", randint1);
		task.expr = task.expr.replace("B", randint2);

		// random arithmetic op
		var randop = randelem(arith_ops);
		task.text = task.text.replace("+", randop);
        task.expr =	task.expr.replace("+", randop);
		
		break;
	}
	case 1: {
		// put random integers in
		var randint1 = randint(1, 999);
	    var randint2 = randint(1, 999);
		task.text = task.text.replace("A", randint1);
		task.text = task.text.replace("B", randint2);
		task.expr = task.expr.replace("A", randint1);
		task.expr = task.expr.replace("B", randint2);

		// random function
		var randfunc1 = randelem(funcs);
		var randfunc2 = randelem(funcs);
		task.text = task.text.replace("D", randfunc1);
		task.text = task.text.replace("E", randfunc2);
		task.expr = task.expr.replace("D", randfunc1);
		task.expr = task.expr.replace("E", randfunc2);

		// random arithmetic op
		var randop = randelem(arith_ops);
		task.text = task.text.replace("+", randop);
		task.expr = task.expr.replace("+", randop);
		
		break;
	}
	default: break;
	}

	// update as current task
	var current = {text: task.text, expr: task.expr, answer: math.eval(task.expr).toString()};
	document.querySelector('.task').innerHTML = current.text;
	current_task = current;
}

function setup() {
	// Get all keys
	var keys = document.querySelectorAll('#calculator span');
	var operators = ['n!', 'log', '(', ')', '^', 'sin', '÷', 'cos', '*', 'tan', '-', 'pi', '=', '+'];
	var verbose = ['log', 'sin', 'cos', 'tan'];
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

				// remove last char if its not a digit
				//if (operators.indexOf(last) > -1 || last == '.')
				//	eq = eq.replace(/.$/, '');
				
				if (eq) {
					var out;
					try {
						out = math.eval(eq);
					}
					catch(err) {
						console.log(eq);
						out = 'error';
					}
					input.innerHTML = out;

					if (current_task.answer != out)
						console.log("NO");
					else
						console.log("YES");
					generate_task();
				}
				
				decAdded = false;
			}
			// operator press
			else if (operators.indexOf(btnVal) > -1) {
				var last = inputVal[inputVal.length - 1];
				
				switch (btnVal) {
					
				case 'n!': {
					if (inputVal != '')
						if ( ['(', '^', '÷', '*', '-', '+'].indexOf(last) < 0 )
							input.innerHTML += '!';
					break;
				}
					
				case 'sin':
				case 'cos':
				case 'tan':
				case 'log': {
					if (inputVal == '') 
						input.innerHTML += btnVal + '(';				
					else 
						if ( ['(', '+', '-', '*', '÷', '^'].indexOf(last) > -1 ) 
							input.innerHTML += btnVal + '(';						
					break;
				}
					
				case 'pi':
				case '(': {
					if (inputVal == '')
						input.innerHTML += btnVal;
					else 
						if ( ['(', '^', '÷', '*', '-', '+'].indexOf(last) > -1 )
							input.innerHTML += btnVal;
					break;
				}
					
				case ')':
				case '^': 
				case '÷':
				case '+':
				case '*': {
					if (inputVal != '') 
						if ( ['(', '^', '÷', '*', '-', '+'].indexOf(last) < 0 ) 
							input.innerHTML += btnVal;
					break;
				}
					
				case '-': {
					if (last != '-')
						input.innerHTML += btnVal;
					break;
				}
					
				default: break;
				}

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
			e.getPreventDefault();
		}
	}


	// generate first task for user
	generate_task();
}

window.onload = setup;
