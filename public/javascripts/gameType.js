$(document).ready(function(){
	$('#gameType').change(function(){
		if($('#gameType').val() === 'singles') {
			$("#1v1").show();
			$("#2v2").hide();
		}
		if($('#gameType').val() === 'doubles') {
			$("#1v1").hide();
			$("#2v2").show();	
		}
		if($('#gameType').val() === 'matchType') {
			$("#1v1").hide();
			$("#2v2").hide();
		}
	});
});