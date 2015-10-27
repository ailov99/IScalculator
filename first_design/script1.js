// get random integer in range
function randint(min, max) {
	return (Math.floor(Math.random() * (max - min + 1)) + min);
}

// get random element from list
function randelem(list) {
	return list[Math.floor(Math.random()*list.length)];
}



// --------------------------- Timer ---------------------------
var date;
// global times record
var times = [];

function time_tap() {
	var new_date = new Date();
	var diff = (new_date - date)/1000;
	date = new_date;
	
	return diff;
}
// -------------------------------------------------------------
// Tasks setup
// templates
var tasks = [{text: "Calculate A + B", expr: "A + B"},
			 {text: "Find the D of E(A+B)", expr: "D(E(A+B))"}];
var arith_ops = ['^', '+' ,'-', '*', '/'];
var funcs = ["sin", "cos", "tan", "log"];

// global user task currently in progress, contains:
// 1. Text to be displayed to user
// 2. Expression to be entered in calculator and solved
// 3. Correct answer of the expression for checking user's answer
var current_task;
// Question counter
var q_count = 1;
// task text record
var task_texts = ['','','','',''];

// Record of keys-to-be-pressed from all tasks (used for Fitt's Law calculations)
var keys_to_press = [];
// Record of keys-to-be-pressed for current task (used for timing)
var current_key_seq = [];
var current_seq_pos = 0;    // current index of key to-be-pressed
var current_seq_times = []; // times of presses so far

// User error counter (misclicks + wrong equation)
var errors_by_task = [0, 0, 0, 0, 0];
var screen_resets_by_task = [0,0,0,0,0];


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
		add_to_keys_record(num1);
		keys_to_press.push(op); current_key_seq.push(op);
		add_to_keys_record(num2);
		keys_to_press.push('='); current_key_seq.push('=');
		keys_to_press.push('CE'); current_key_seq.push('CE');
		date = new Date();
		break;
	}
	case 2: {
		var num1 = randint(1,99);
		task = {text: 'Find the value of ' + num1 + ' squared',
				answer: math.eval(num1+'^2')};
		add_to_keys_record(num1);
		keys_to_press.push('^'); current_key_seq.push('^');
		keys_to_press.push('2'); current_key_seq.push('2');
		keys_to_press.push('='); current_key_seq.push('=');
		keys_to_press.push('CE'); current_key_seq.push('CE');
		console.log(times);
		console.log(current_key_seq);
		console.log(current_seq_pos);
		console.log(current_seq_times);
		break;
	}
	case 3: {
		var num1 = randint(1,99);
		var func = randelem(funcs);
		task = {text: 'Find the ' + func + ' of ' + num1,
				answer: math.eval(func+'('+num1+')')};
		keys_to_press.push(func.toString()); current_key_seq.push(func.toString());
		add_to_keys_record(num1);
		keys_to_press.push(')'); current_key_seq.push(')');
		keys_to_press.push('='); current_key_seq.push('=');
		keys_to_press.push('CE'); current_key_seq.push('CE');
				console.log(times);
		console.log(current_key_seq);
		console.log(current_seq_pos);
		console.log(current_seq_times);
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
		keys_to_press.push(func.toString()); current_key_seq.push(func.toString());
		add_to_keys_record(num1);
		keys_to_press.push('.'); current_key_seq.push('.');
		add_to_keys_record(num2);
		keys_to_press.push(op); current_key_seq.push(op);
		add_to_keys_record(num3);
		keys_to_press.push(')'); current_key_seq.push(')');
		keys_to_press.push('='); current_key_seq.push('=');
		keys_to_press.push('CE'); current_key_seq.push('CE');
		break;
	}
	case 5: {
		var num1 = randint(1,50);
		task = {text: 'What is the area of a circle with a radius of   ' + num1 + ' ? ( hint: A = pi*square(r) )',
				answer: math.eval('pi*'+num1+'^2')};
		keys_to_press.push('pi'); current_key_seq.push('pi');
		keys_to_press.push('*'); current_key_seq.push('*');
		add_to_keys_record(num1);
		keys_to_press.push('^'); current_key_seq.push('^');
		keys_to_press.push('2'); current_key_seq.push('2');
		keys_to_press.push('='); current_key_seq.push('=');
		break;
	}
	default: {
		task = {text: 'CONGRATULATIONS! YOU HAVE FINISHED THE QUIZ!',
				answer: ''};
		$('#task_pane').remove();
		show_pie_chart();
		plot_ID_linechart();
		plot_one();
		return;
	}
	}

	var display_string = 'Q' + generate_task.q_count + '. ' + task.text;
	document.querySelector('.task').innerHTML = display_string;
	task_texts[generate_task.q_count - 1] = display_string.substring(0, 9);  // keep task's generated text for the records
	current_task = task;
}

function setup() {
	// Get all keys
	var keys = document.querySelectorAll('#calculator span');
	var operators = ['n!', 'log', '(', ')', '^', 'sin', '/', 'cos', '*', 'tan', '-', 'pi', '=', '+'];
	var verbose = ['log', 'sin', 'cos', 'tan'];
	var decAdded = false;

	
	// Hook onclick events to all keys
	for (var i = 0; i < keys.length; i++) {
		keys[i].onclick = function(e) {
			// get input and button values
			var input = document.querySelector('.screen');
			var inputVal = input.innerHTML;
			var btnVal = this.innerHTML;

			// check if user is currently entering the correct key from the current sequence
			if (btnVal == current_key_seq[current_seq_pos]) {
				current_seq_pos++;  // increment to next key
				current_seq_times.push(time_tap());
			}
			else {
				
			//	current_seq_pos = 0; // user pressed wrong key => reset seq
			//	current_seq_times = []; // reset times
			}
				
			// erase on CE press
			if (btnVal == 'CE') {
				input.innerHTML = '';
				decAdded = false;
				// record the screen reset
				if (screen_resets_by_task[generate_task.q_count - 1] == 0) {
					screen_resets_by_task[generate_task.q_count - 1]++;
					times.push(time_tap());
				}
				else {
					errors_by_task[generate_task.q_count - 1]++; 
					current_seq_pos = 0; // user pressed wrong key => reset seq
					current_seq_times = []; // reset times
				}
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
						out = 'error';  // invalid expression
					}
					input.innerHTML = out;

					if (current_task.answer == out) {
						for (var i =0 ; i < current_seq_times.length; i++) times.push(current_seq_times[i]);
						current_seq_pos = 0;    //  reset seq
   						current_seq_times = []; // reset times
						current_key_seq = [];
						generate_task();  // correct  answer -> generate a new task
					}

						
					/* Do not register an error if the user's answer is incorrect.
					   This will be handled by the user pressing 'CE' by himself.
                       Else, they cannot proceed any further with the tasks.      */
				}
				decAdded = false;
			}
			// operator press
			else if (operators.indexOf(btnVal) > -1) {
				var last = inputVal[inputVal.length - 1];
				
				switch (btnVal) {
					
				case 'n!': {
					if (inputVal != '')
						if ( ['(', '^', '/', '*', '-', '+'].indexOf(last) < 0 )
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
						if ( ['(', '+', '-', '*', '/', '^'].indexOf(last) > -1 ) 
							input.innerHTML += btnVal + '(';						
					break;
				}
					
				case 'pi':
				case '(': {
					if (inputVal == '')
						input.innerHTML += btnVal;
					else 
						if ( ['(', '^', '/', '*', '-', '+'].indexOf(last) > -1 )
							input.innerHTML += btnVal;
					break;
				}
					
				case ')':
				case '^': 
				case '/':
				case '+':
				case '*': {
					if (inputVal != '') 
						if ( ['(', '^', '/', '*', '-', '+'].indexOf(last) < 0 ) 
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

	// Event hook for the "dot" plotting of user clicks on the calculator
	$('#calculator').on('click', function(e) {
		var offs = $('#calculator').offset();
		click_coords_record.push([e.clientX - offs.left - 20, e.clientY - offs.top - 20]);
	});
}

window.onload = setup;


// ----------------------------- Line Chart --------------------------------------------------------
// Taken from "http://nvd3.org/examples/line.html"
// and modified for own purposes
// Renders the linechart for the IDs
function plot_ID_linechart() {

	nv.addGraph(function() {
		var chart = nv.models.lineChart()
            .margin({left: 100})  //Adjust chart margins to give the x-axis some breathing room.
            .useInteractiveGuideline(true)  //We want nice looking tooltips and a guideline!  
            .showYAxis(true)        //Show the y-axis 
            .showXAxis(true)        //Show the x-axis
			.forceY(3)
		;

		chart.xAxis     //Chart x-axis settings
	  		.axisLabel('Tasks (#)')
			.ticks(10)
			 .tickFormat(d3.format(',r'));

		chart.yAxis     //Chart y-axis settings
            .axisLabel('Difficulty Index (ID)')
             .tickFormat(d3.format('.02f'));

		/* Done setting the chart up? Time to render it! */
		var myData = [ { values: ID_list_to_plot(get_ID_list(keys_to_press)), key: 'ID', color: '#2ca02c' } ];  

		d3.select('#line_svg')    //Select the <svg> element you want to render the chart in.   
		  .datum(myData)         //Populate the <svg> element with chart data...
          .call(chart);          //Finally, render the chart!

		//Update the chart when window resizes.
		nv.utils.windowResize(function() { chart.update() });
		
		return chart;
	});
}


// parses the ready ID list to format suitable for plotting
// [ {x:1, y:22}, ...... ]
function ID_list_to_plot(ID_list) {
	var data = [];
	
	for (var i = 0; i < ID_list.length; ++i) {
		var ob = {x: i+1, y: ID_list[i]};
		data.push(ob);
	}

	return data;
}

// generate list of ID's for each user action using Fitt's Law
// commands_list : list of commands to-be-executed by the user
function get_ID_list(commands_list) {
	console.log(commands_list);
	var ID_list = [];
	var w = 66;  // constant pixel width
	var a = get_dist("#pie_chart", get_tag(commands_list[0]));    // distance to widget
	
	ID_list.push(math.log(a/w + 1));

	for (var i = 0; i < commands_list.length - 1; ++i) { 
		a = get_dist(get_tag(commands_list[i]), get_tag(commands_list[i+1]));
		ID_list.push(math.log(a/w + 1));
	}

	return ID_list;
}

// parse keys as tags for JQuery
function get_tag(key) {
	switch(key) {
	case 'n!': return "#b_fact";
	case '(': return "#b_opbrace";
	case ')': return "#b_clbrace";
	case '^': return "#b_pow";
	case '/': return "#b_div";
	case '*': return "#b_mul";
	case '-': return "#b_min";
	case '=': return "#b_eq";
	case '+': return "#b_add";
	case '.': return "#b_dec";
	default: return "#b_" + key;
	}
}

// calculate distance between two DIVs given their tags
function get_dist(id1, id2) {
	try {
	return Math.max(Math.abs($(id1).offset().left - $(id2).offset().left),
					Math.abs($(id1).offset().top - $(id2).offset().top));

	}catch(err) {
		console.log(id1);
		console.log(id2);
	}
}

//---------------------- User Clicks Plot  -----------------------------
// Taken from "http://bl.ocks.org/mbostock/fe3f75700e70416e37cd"
// and modified for own purposes

// record of user clicks on the calculator
var click_coords_record = [];


// Plots user clicks as dots
function plot_one() {

	var svg = d3.select("#plot_wrap")
		.append("svg")
		.attr("width", 358)
		.attr("height", 275)
		.attr("class", "graph-svg-component");

	d3.timer(function() {
		for (var i = 0; i < click_coords_record.length; ++i) {
			svg.append("circle")
				.attr("cx", click_coords_record[i][0])
				.attr("cy", click_coords_record[i][1])
				.attr("r", 0)
				.transition()
				.attr("r", 2);
		}
		return true;
	});
}

//----------------------------------------------------------------------------------
// add expected key presses to both records (keys_to_press & current_key_seq)
function add_to_keys_record(arg) {
	var stringified = arg.toString();
	for (var i = 0; i < stringified.length; ++i) {
		keys_to_press.push(stringified[i]);
		current_key_seq.push(stringified[i]);
	}
}

//---------------------------- Pie Chart -------------------------------------------------
// Taken from "http://nvd3.org/examples/pie.html"
// and modified for own purposes
function show_pie_chart() {
	nv.addGraph(function() {
		var chart = nv.models.pieChart()
			.x(function(d) { return d.label })
			.y(function(d) { return d.value })
			.showLabels(true);

		d3.select("#pie_svg")
			.datum(gen_pie_data())
			.transition().duration(350)
			.call(chart);

		return chart;
	});
}

//Pie chart data generator. Uses records of user errors
function gen_pie_data() {
  return  [
      { 
        "label": task_texts[0],
        "value" : errors_by_task[0]
      } , 
      { 
        "label": task_texts[1],
        "value" : errors_by_task[1]
      } , 
      { 
        "label": task_texts[2],
        "value" : errors_by_task[2]
      } , 
      { 
        "label": task_texts[3],
        "value" : errors_by_task[3]
      } , 
      { 
        "label": task_texts[4],
        "value" : errors_by_task[4]
      } 
    ];
}

// ------------------------- Table generation -------------------------
// Taken from "http://stackoverflow.com/questions/14643617/create-table-using-javascript"
// and modified for own purposes
function tableCreate(){
    var body = document.body,
        tbl  = document.createElement('table');
    tbl.style.width  = '100px';
    tbl.style.border = '1px solid black';

    for(var i = 0; i < 10; i++){
        var tr = tbl.insertRow();
        for(var j = 0; j < 5; j++){
			if (i == 0) {
				var td = tr.insertCell();
				switch(j) {
				case 0:
					td.appendChild(document.createTextNode('Task #'));
					td.style.border = '1px solid black';
					break;
				case 1:
					td.appendChild(document.createTextNode('W(idth)'));
					td.style.border = '1px solid black';
					break;
				case 2:
					td.appendChild(document.createTextNode('ID'));
					td.style.border = '1px solid black';
					break;
				case 3:
					td.appendChild(document.createTextNode('MT (milis)'));
					td.style.border = '1px solid black';
					break;
				case 4:
					td.appendChild(document.createTextNode('TP (b/s)'));
					td.style.border = '1px solid black';
					break;
				default: break;
				}
			}
			else {
				// POPULATE rows

			}   
        }
    }
    body.appendChild(tbl);
}

