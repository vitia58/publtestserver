function login() {
	let arr = {login: $("#login").val(), password: $("#password").val()}
	$.ajax({
		url: 'api/login',
		type: 'POST',
		data: JSON.stringify(arr),
		contentType: 'application/json; charset=utf-8',
		dataType: 'json',
		async: false,
		success: function(result) {
			$("#result").text(result.result).removeClass().addClass(result.type);
			if(result.type==='success'){
				setTimeout(function () {
					location.reload();
				}, 1500)
			}

		}
	});
}