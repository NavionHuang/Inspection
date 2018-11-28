/**
 * Created by 2018040005 on 2018/5/7.
 */
function getRootPath() {
	// 获取当前网址，如： http://localhost:8088/test/test.jsp
	var curPath = window.document.location.href;
	// 获取主机地址之后的目录，如： test/test.jsp
	var pathName = window.document.location.pathname;
	var pos = curPath.indexOf(pathName);
	// 获取主机地址，如： http://localhost:8088
	var localhostPaht = curPath.substring(0, pos);
	// 获取带"/"的项目名，如：/test
	var projectName = pathName
			.substring(0, pathName.substr(1).indexOf('/') + 1);
	return (localhostPaht + projectName);
}
var productBarCodes;
var regua=/^\w{18,28}$/;
var regu = /^[ ]+$/;
// 校验彩盒条码
function box() {
	var boxBarCode = $("#boxBarCode").val().trim();
	var name = $(".name").val();
	if (regu.test(name) || name == "" || name == null || name == undefined) {
		mes("请输入检验人");
		$(".name").val("");
		$(".name").focus();
		return;
	}
	if(!regua.test(boxBarCode)){
		mes("不符合条码规则");
		document.getElementById("boxBarCode").value = "";
		document.getElementById("boxBarCode").focus();
		return;
	}
	$.ajax({
		url : getRootPath() + "/inspection/box",
		type : "post",
		data : "boxBarCode=" + boxBarCode,
		dataType : "text",
		success : function(data) {
			if (data) {
				document.getElementById("p").play();
				productBarCodes = data;
				$("#left").append("<div>" + productBarCodes + "</div>");
			}else{
				mes("此彩盒条码未录入");
				document.getElementById("boxBarCode").value = "";
				document.getElementById("boxBarCode").focus();
				return;
			}
		},
		error : function(err) {
			mes("查询异常");
			document.getElementById("boxBarCode").value = "";
			document.getElementById("boxBarCode").focus();
			return;
		}
	})
	document.getElementById("productBarCode").value = "";
	document.getElementById("productBarCode").focus();
}
// 检验中箱编码
function inspection() {
	//左边没有子元素
	if ($("#left").children().length==0){
		mes("未找到彩盒条码,请稍后再试");
		document.getElementById("boxBarCode").value = "";
		document.getElementById("boxBarCode").focus();
		return;
	}
	var productBarCode = $("#productBarCode").val().trim();
	if (regu.test(productBarCode) || productBarCode == ""
			|| productBarCode == null || productBarCode == undefined) {
		mes("请输入产品条码");
		document.getElementById("productBarCode").value = "";
		document.getElementById("productBarCode").focus();
		return;
	}
	if(!regua.test(productBarCode)){
		mes("不符合条码规则");
		document.getElementById("productBarCode").value = "";
		document.getElementById("productBarCode").focus();
		return;
	}
	var newNode = document.createElement("div");
	newNode.innerText = productBarCode;
	if (productBarCode == productBarCodes) {
		document.getElementById("p").play();
		newNode.className = "ok";
		document.getElementById("right").appendChild(newNode);
		document.getElementById("productBarCode").value = "";
		document.getElementById("productBarCode").focus();
	} else {
		document.getElementById("f").play();
		newNode.className = "ng";
		document.getElementById("right").appendChild(newNode);
		document.getElementById("productBarCode").value = "";
		document.getElementById("productBarCode").focus();
	}

	save();// 自动保存

}
// 保存检验记录
function save() {
	var name = $(".name").val().trim();// 检验人
	var boxBarCode = $("#boxBarCode").val().trim();// 彩盒条码
	var originalData = "";// 源数据
	var inspectionData = "";// 检验数据
	var inspectionResult = "OK";// 检验结果
	var $left = $("#left").children("div");
	$left.each(function() {
		originalData = $(this).text();
	});
	var $right = $("#right").children("div");
	$right.each(function() {
		inspectionData = $(this).text();
		if ($(this).attr("class") == "ng") {
			inspectionResult = "NG";
		}
	});
	if (regu.test(name) || name == "" || name == null || name == undefined) {
		mes("请输入检验人");
		return;
	}
	if (regu.test(boxBarCode) || boxBarCode == "" || boxBarCode == null
			|| boxBarCode == undefined) {
		mes("请输入彩盒条码:");
		return;
	}
	if (regu.test(originalData) || originalData == "" || originalData == null
			|| originalData == undefined) {
		mes("请先点击'检验'按钮");
		return;
	}
	if (regu.test(inspectionData) || inspectionData == ""
			|| inspectionData == null || inspectionData == undefined) {
		mes("请先输入产品条码,按'确定'按钮进行检验");
		return;
	}

	$.ajax({
		url : getRootPath() + "/inspection/save",
		type : "post",
		data : "{\"boxBarCode\" : \"" + boxBarCode + "\",\"createName\" : \""
				+ name + "\",\"originalData\" : \"" + originalData
				+ "\",\"inspectionData\" : \"" + inspectionData
				+ "\",\"inspectionResult\" : \"" + inspectionResult + "\"}",
		contentType : "application/json",
		dataType : "json",
		success : function(data) {
			if (data) {
				if (data.code == 500) {
					alert(data.msg);
					window.location.reload();
				} else {
					if (inspectionResult == "NG") {
						document.getElementById("f").play();
						alert("检验记录保存成功，检验结果【" + inspectionResult + "】");
						$(".name").val(data.data);
						$("#left").html("");
						$("#right").html("");
						$("#boxBarCode").val("");
						$("#boxBarCode").focus();
					} else {
						mesOK("检验记录保存成功，检验结果【" + inspectionResult + "】")
						$(".name").val(data.data);
						$("#left").html("");
						$("#right").html("");
						$("#boxBarCode").val("");
						$("#boxBarCode").focus();
					}
				}
			}
		},
		error : function(e) {
			alert("保存检验记录异常");
			window.location.reload();
		}
	})

}

$(document).ready(
		function() {
			if (!$(".name").val()) {
				$(".name").focus();
			}
			// 检测人回车事件
			$(".name").keydown(
					function(e) {
						var curKey = e.which;
						if (curKey == 13) {
							var name = $(".name").val().trim();
							if (regu.test(name) || name == "" || name == null
									|| name == undefined) {
								mes("请输入检验人");
								$(".name").val("");
								$(".name").focus();
							} else {
								$("#boxBarCode").val("");
								$("#boxBarCode").focus();
							}
						}
					});

			// trayBarCode回车事件
			$("#boxBarCode").keydown(function(e) {
				var curKey = e.which;
				if (curKey == 13) {
					box();
				}
			});

			// packageBarCode回车事件
			$("#productBarCode").keydown(function(e) {
				var curKey = e.which;
				if (curKey == 13) {
					inspection();
				}
			});
			// 空格键触发save
			$(document).keydown(function(e) {
				var curKey = e.which;
				if (curKey == 32) {
					save();
				}
			});

		});
// 消息框
function mes(text) {
	document.getElementById("f").play();
	$(".mes").text(text).show();
	setTimeout(function() {
		$(".mes").hide();
	}, 3000);
}
function mesOK(text) {
	document.getElementById("p").play();
	$(".mes").text(text).show();
	setTimeout(function() {
		$(".mes").hide();
	}, 3000);
}