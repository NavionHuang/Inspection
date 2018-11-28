/**
 * Created by 2018040005 on 2018/5/11.
 */
$(function() {
	if ($("#page").val() == "") {
		$("#form").submit();
	}
	//隔行变色
	$(".table tr:even").addClass('even');
	// 回车事件
	$(document).keydown(function(e) {
		var curKey = e.which;
		if (curKey == 13) {
			$("#page").val(1);
			$("#form").submit();
		}
	});
	// 时间控件
	laydate.render({
		elem : '#date'
	});
});
//查询
function query(){
	$("#page").val(1);
	$("#form").submit();
}
// 上一页
function previousPage() {
	var page = $("#page").val();
	if (page > 1) {
		$("#page").val(page - 1)
		$("#form").submit();
	}
}
// 下一页
function nextPage() {
	var page = $("#page").val();
	$("#page").val(page * 1 + 1);
	$("#form").submit();
}
