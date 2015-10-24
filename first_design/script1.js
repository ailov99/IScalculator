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
// Question counter
var q_count = 1;


// Generate a task for the user
function generate_task() {
	generate_task.q_count = ++generate_task.q_count || 1;
	var task;
	
	switch (generate_task.q_count) {
	case 1: {
		var num1 = randint(1,99);
		var num2 = randint(1,99);
		var op = randelem(arith_ops);
		task = {text: 'Calculate ' + num1 + op + num2,
				answer: math.eval(num1+op+num2).toString()};
		break;
	}
	case 2: {
		var num1 = randint(1,99);
		task = {text: 'Find the square of ' + num1,
				answer: math.eval(num1+'^2')};
		first_plot();
		break;
	}
	case 3: {
		var num1 = randint(1,99);
		var func = randelem(funcs);
		task = {text: 'Find the ' + func + ' of ' + num1,
				answer: math.eval(func+'('+num1+')')};
		break;
	}
	case 4: {
		var num1 = randint(1,99);
		var num2 = randint(1,99);
		var num3 = randint(1,99);
		var func = randelem(funcs);
		var op = randelem(arith_ops);
		task = {text: 'What is the ' + func + ' of ' + num1 + '.' + num2 + op + num3 + ' ?',
				answer: math.eval(func+'('+num1+'.'+num2+op+num3+')')};
		break;
	}
	case 5: {
		var num1 = randint(1,50);
		task = {text: 'What is the area of a circle with a radius of   ' + num1 + ' ? ( hint: A = pi*sqrt(r) )',
				answer: math.eval('pi*'+num1+'^2')};
		break;
	}
	default: {
		task = {text: 'CONGRATULATIONS! YOU HAVE FINISHED THE QUIZ!',
				answer: ''};
		$( "#dialog" ).dialog( "open" );
		
		break;
	}
	}
	
	document.querySelector('.task').innerHTML = 'Q' + generate_task.q_count + '. ' + task.text;
	current_task = task;
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
					else {
						console.log("YES");
						generate_task();
					}
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
	//plot_one();
	//d3.select("body").select("#rightpane").on("mousemove", function() {var pt = d3.mouse(this); tick(pt);});
	// generate first task for user
	generate_task();
}

window.onload = setup;

// record of user clicks on the calculator
var click_coords_record = [];

// Callback for calculator clicks
function calc_click(event) {
    pos_x = event.offsetX?(event.offsetX):event.pageX-document.getElementById("calculator").offsetLeft;
	pos_y = event.offsetY?(event.offsetY):event.pageY-document.getElementById("calculator").offsetTop;
	// get coords of element under cursor
	//pos_x = event.offsetX?(event.offsetX):event.pageX-document.getElementById(document.elementFromPoint(event.clientX, event.clientY)).offsetLeft;
	//pos_y = event.offsetY?(event.offsetY):event.pageY-document.getElementById(document.elementFromPoint(event.clientX, event.clientY)).offsetTop;
//	console.log(pos_x);
	//	console.log(pos_y);
	click_coords_record.push([pos_x, pos_y]);
}

// mouse movement coords tick
function tick(pt) {
	console.log(pt[0]);
	console.log(pt[1]);
}

$(function() {
  $( "#dialog" ).dialog({
    autoOpen: false,
    show: {
      effect: "blind",
      duration: 1000
    },
    hide: {
      effect: "explode",
      duration: 1000
    }
  });
});

// Plots user clicks as dots
function plot_one() {

	var sample = uniformRandomSampler(1000);

	var svg = d3.select("#plot_wrap")
		.append("svg")
		.attr("width", 358)
		.attr("height", 275)
		.attr("class", "graph-svg-component");

	d3.timer(function() {
		for (var i = 0; i < 10; ++i) {
			var s = sample();
			if (!s) return true;
			svg.append("circle")
				.attr("cx", s[0])
				.attr("cy", s[1])
				.attr("r", 0)
				.transition()
				.attr("r", 2);
		}
	});
}

function uniformRandomSampler(numSamplesMax) {
  var numSamples = 0;
  return function() {
      if (++numSamples > numSamplesMax) return;
	  var ran = randelem(click_coords_record);
      //return [ran[0], ran[1]];
	  return [randint(0,500), randint(0,500)];
  };
}
