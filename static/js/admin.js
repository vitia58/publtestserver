/*function clangetitle() {
	var input = $('#title');
	var buffer = $('.input-buffer');
	buffer.text(input.val());
	console.log(buffer.width());
	input.width(buffer.width());
}*/
$(document).ready(function() {
	const titleblock = $("#titleblock");
	var top = Math.floor(titleblock.height()+titleblock.offset().top);
	console.log(top);
	$(".body").css('margin-top', top);
});
function publish() {
	var title = $("#title");
	var titleText = title.val();
	var body = $("#body");
	var bodyText = body.val();
	if(titleText.length===0)title[0].focus();
	else if(bodyText.length===0)body[0].focus();
	else{
		let arr = {title: titleText, body: bodyText};
		$.ajax({
			url: 'newArticle',
			type: 'POST',
			data: JSON.stringify(arr),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			success: function(result) {
				console.log(result);
				if(result.result==="Success"){
					title.val('');
					body.val('');
				}
			}
		});
	}
}