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
var packageBarCodes;
var regua=/^\w{18,28}$/;
var regu = /^[ ]+$/;
var num = 0;// 检验次数
var codeArray = new Array();// 检验的条码
// 查询中箱编码
function tray() {
	var trayBarCode = $("#trayBarCode").val().trim();
	var name = $(".name").val();
	if (regu.test(name) || name == "" || name == null || name == undefined) {
		mes("请输入检验人");
		$(".name").val("");
		$(".name").focus();
		return;
	}
	if(!regua.test(trayBarCode)){
		mes("不符合条码规则");
		document.getElementById("trayBarCode").value = "";
		document.getElementById("trayBarCode").focus();
		return;
	}
	$.ajax({
		url : getRootPath() + "/inspection/tray",
		type : "post",
		data : "trayBarCode=" + trayBarCode,
		dataType : "json",
		success : function(data) {
			if (data) {
				document.getElementById("p").play();
				// 讲返回数据转为字符串数组
				packageBarCodes = eval(data);
				$("#size").text("【"+packageBarCodes.length+"】");
				for (i = 0; i < packageBarCodes.length; i++) {
					$("#left").append("<div>" + packageBarCodes[i] + "</div>");
				}
			}
		},
		error : function(err) {
			mes("此卡板条码未录入");
			document.getElementById("trayBarCode").value = "";
			document.getElementById("trayBarCode").focus();
			return;
		}
	})
	
	document.getElementById("packageBarCode").value = "";
	document.getElementById("packageBarCode").focus();
}
// 检验中箱编码
function inspection() {
	//左边没有子元素
	if ($("#left").children().length==0){
		mes("未找到卡板条码,请稍后再试");
		document.getElementById("trayBarCode").value = "";
		document.getElementById("trayBarCode").focus();
		return;
	}
	var packageBarCode = $("#packageBarCode").val().trim();
	if (regu.test(packageBarCode) || packageBarCode == ""
			|| packageBarCode == null || packageBarCode == undefined) {
		mes("请输入中箱编码");
		document.getElementById("packageBarCode").value = "";
		document.getElementById("packageBarCode").focus();
		return;
	}
	if(!regua.test(packageBarCode)){
		mes("不符合条码规则");
		document.getElementById("packageBarCode").value = "";
		document.getElementById("packageBarCode").focus();
		return;
	}
	for (i = 0; i < codeArray.length; i++) {
		if (packageBarCode == codeArray[i]) {
			mes("中箱编码重复");
			document.getElementById("packageBarCode").value = "";
			document.getElementById("packageBarCode").focus();
			return;
		}
	}
	var newNode = document.createElement("div");
	newNode.innerText = packageBarCode;
	for (i = 0; i < packageBarCodes.length; i++) {
		if (packageBarCode == packageBarCodes[i]) {
			document.getElementById("p").play();
			newNode.className = "ok";
			document.getElementById("right").appendChild(newNode);
			document.getElementById("packageBarCode").value = "";
			document.getElementById("packageBarCode").focus();
			break;
		}
		newNode.className = "ng";
		document.getElementById("right").appendChild(newNode);
		document.getElementById("packageBarCode").value = "";
		document.getElementById("packageBarCode").focus();
	}
	if(newNode.className == "ng"){
		document.getElementById("f").play();	
	}
	// 添加已检验条码
	codeArray.push(packageBarCode);
	// 检验的条码数量
	num++;
	if (num == packageBarCodes.length) {
		num = 0;
		codeArray = [];// 清空数组
		save();// 自动保存
	}
}
// 保存检验记录
function save() {
	var name = $(".name").val().trim();// 检验人
	var trayBarCode = $("#trayBarCode").val().trim();// 卡板编码
	var originalData = "";// 源数据
	var inspectionData = "";// 检验数据
	var inspectionResult = "OK";// 检验结果
	var $left = $("#left").children("div");
	$left.each(function() {
		originalData += $(this).text() + ".";
	});
	var $right = $("#right").children("div");
	$right.each(function() {
		inspectionData += $(this).text() + ".";
		if ($(this).attr("class") == "ng") {
			inspectionResult = "NG";
		}
	});
	if (regu.test(name) || name == "" || name == null || name == undefined) {
		mes("请输入检验人");
		return;
	}
	if (regu.test(trayBarCode) || trayBarCode == "" || trayBarCode == null
			|| trayBarCode == undefined) {
		mes("请输入卡板编码:");
		return;
	}
	if (regu.test(originalData) || originalData == "" || originalData == null
			|| originalData == undefined) {
		mes("请先点击'检验'按钮");
		return;
	}
	if (regu.test(inspectionData) || inspectionData == ""
			|| inspectionData == null || inspectionData == undefined) {
		mes("请先输入中箱编码,按'确定'按钮进行检验");
		return;
	}

	$.ajax({
		url : getRootPath() + "/inspection/save",
		type : "post",
		data : "{\"trayBarCode\" : \"" + trayBarCode + "\",\"createName\" : \""
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
						$("#trayBarCode").val("");
						$("#trayBarCode").focus();
					} else {
						mesOK("检验记录保存成功，检验结果【" + inspectionResult + "】")
						$(".name").val(data.data);
						$("#left").html("");
						$("#right").html("");
						$("#trayBarCode").val("");
						$("#trayBarCode").focus();
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
								$("#trayBarCode").val("");
								$("#trayBarCode").focus();
							}
						}
					});

			// trayBarCode回车事件
			$("#trayBarCode").keydown(function(e) {
				var curKey = e.which;
				if (curKey == 13) {
					tray();
				}
			});

			// packageBarCode回车事件
			$("#packageBarCode").keydown(function(e) {
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