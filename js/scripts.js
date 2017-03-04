$(document).ready(function()
{

	window.onload=Init();

	function Init(){
		try
		{		
			items = JSON.parse(localStorage.getItem("numArray"));
			var len = items.length;
			for (var i = 0; i < len; i++) {
				AddTestToView(items[i], localStorage.getItem(items[i]));
			}
		}catch (err) {
			console.log(err);
		}
	}

	function onFileSelect(e) {
	 	var 
	 		f = e.target.files[0], // Первый выбранный файл
	 		reader = new FileReader ;
	 	reader.readAsDataURL(f);
	 	reader.onload = function(e) {
	 		$.get(e.target.result, function(data) {
				var myvar = data;
	 	  		myvar.split('\n').forEach(line => {
    			  	var nameAndExpression = line.split(' ');
    			  	var name = nameAndExpression[0];
    			  	var expression = nameAndExpression.slice(1);
    			  	AddTest(name, expression.join(''));
    			});
			});
	 	}
	}
	 
	if(window.File && window.FileReader && window.FileList && window.Blob) {
	  document.querySelector("input[type=file]").addEventListener("change", onFileSelect, false);
	} else {
	  console.warn( "You browser don't support FileAPI")
	}

	function AddTestToView(name, expression)
	{
		$('<label/>', {
			class: "list-group-item",
			title: expression
		}).append("<div class=\"row\"><input type=\"checkbox\" value=\"" + expression + "\"><div class=\"col-md-4 name\">"+ name + "</div><div class=\"col-md-8 regexpListElement\">" + expression + "</div></div>").appendTo("#testListBox");		
		
	}
	function AddTest(name, expression)
	{
		
		var localStr = localStorage.getItem("numArray");

		var arr;
		if(localStr == "" || localStr  == null)
		{
			arr = []
		}
		else
		{
			arr	= JSON.parse(localStr);
		}

		if(arr == "null" || arr == null)
		{
			arr = new Array()
		}

		if((arr.indexOf( name ) == -1))
		{
			AddTestToView(name, expression);
			arr.push(name);	
			localStorage.setItem("numArray", JSON.stringify(arr));
			localStorage.setItem(name,expression);
		}
	}

	Array.prototype.remove = function(value) {
	    var idx = this.indexOf(value);
	    if (idx != -1) {
	        // Второй параметр - число элементов, которые необходимо удалить
	        return this.splice(idx, 1);
	    }
	    return false;
	}

	function RemoveTest(element)
	{
		var name = element.parent(".row").children(".name").text();
		element.parent(".row").parent(".list-group-item").detach();
		localStorage.removeItem(name);

		items = JSON.parse(localStorage.getItem("numArray"));
		items.remove(name);

		localStorage.setItem("numArray", JSON.stringify(items));
	}


	$('#buttonDelete').on('click', function(e){
		var elements = $('#testListBox input:checked');
		if(elements.length > 0)
		{
			elements.each(function() {
				RemoveTest($(this));
			});
		}
		return false;
	});

	$('#addTestButton').on('click', function(e){
		if(!(!$("#inputTestExpression").val() || !$("#inputTestName").val()))
		{
			var expression = $("#inputTestExpression").val();
			var name = $("#inputTestName").val();

			AddTest(name, expression);
						
			$("#inputTestName").val("");
			$("#inputTestExpression").val("")
		}
		else
		{
			var text;
			if(!$("#inputTestExpression").val())
			{
				text = "enter test expression";
			}
			else if(!$("#inputTestName").val())
			{
				text = "enter test name";
			}
			alert(text);
			
		}
		return false;
	});
	
	function Generate()
	{
		$(".tableHead").empty();
		$("#resultTable tbody").empty();

		$(".tableHead").append("<th>#</th>");

		$('#testListBox label').each(function() {
			$(".tableHead").append("<th>" + $(this).text() + "</th>");
		});

		for(var i = 0; i < $('#testCountVal').val(); i++)
		{
			result = "<tr><th>" + i + "</th>";
		
			$('#testListBox label').each(function() {
				var name = $(this).attr("title");
				randexp = new RandExp(name, 0).gen();
				result += "<th>" + randexp + "</th>";
			});

			result += "</tr>";

			$("#resultTable tbody").append(result);

			result = "";
		}
		$(".tableHead").empty();
		$("#resultTable tbody").empty();

		$(".tableHead").append("<th>#</th>");

		$('#testListBox label').each(function() {
			$(".tableHead").append("<th>" + $(this).text() + "</th>");
		});

		for(var i = 0; i < $('#testCountVal').val(); i++)
		{
			result = "<tr><th>" + i + "</th>";
		
			$('#testListBox label').each(function() {
				randexp = new RandExp($(this).attr("title"), 0).gen();
				result += "<th>" + randexp + "</th>";
			});

			result += "</tr>";

			$("#resultTable tbody").append(result);

			result = "";
		}
	}

	$('#testGenerator').submit(function(){
		Generate();
		return false;
	});

	$('#saveButton').on('click', function(e){
		
		var textFile = "#";
		textFile += ","
		$('#testListBox label').each(function() {
			console.log($(this).children(".name").text());
			var str = $(this).children(".name").text()
			textFile +=  str;
			textFile += ",";
		});
		
		textFile+="\n";

		for(var i = 0; i < $('#testCountVal').val(); i++)
		{
			textFile+= i.toString() + ",";
		
			$('#testListBox label').each(function() {
				randexp = new RandExp($(this).attr("title"), 0).gen();
				textFile+= randexp + ",";
			});
			textFile+="\n";
		}

		saveTextAs(textFile, "tests.txt", "utf-8");

		return false;
	});

	$('#showButton').on('click', function(e){
		
		Generate();

		return false;
	});


	var checked = false;
	$('#selectAll').on('click', function(e){
		checked = !checked;
		$('#testListBox label input').each(function() {
			$(this).prop('checked', checked);
		});
		return false;
	});

	//regexp patterns
	$("#phonePattern").on('click', function(e){
		AddTest("Phone", "[0-9]{2}-[0-9]{2}-[0-9]{2}|[0-9]{1}[(][0-9]{3}[)][0-9]{3}-[0-9]{3}-[0-9]{2}|[+7]{1}[(][0-9]{3}[)][0-9]{3}-[0-9]{3}-[0-9]{2}");
		return false;
	});
});
