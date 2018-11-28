/**
 * Created by 2018040005 on 2018/5/7.
 */
// var productBarCodes = ["abc", "def", "ghi", "jkl"];
function getRootPath(){
    // 获取当前网址，如： http://localhost:8088/test/test.jsp
    var curPath=window.document.location.href;
    // 获取主机地址之后的目录，如： test/test.jsp
    var pathName=window.document.location.pathname;
    var pos=curPath.indexOf(pathName);
    // 获取主机地址，如： http://localhost:8088
    var localhostPaht=curPath.substring(0,pos);
    // 获取带"/"的项目名，如：/test
    var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);
    return(localhostPaht+projectName);
}
var productBarCodes;
var regua=/^\w{18,28}$/;
var regu = /^[ ]+$/;
var num=0;// 检验次数
var codeArray=new Array();// 检验的条码
// 查询产品编码
function package() {
	var packageBarCode = $("#packageBarCode").val().trim();
	var name = $(".name").val().trim();
	if (regu.test(name) || name == "" || name == null || name == undefined) {
		mes("请输入检验人");
		document.getElementById("name").value = "";
		document.getElementById("name").focus();
		return;
	}
	if(!regua.test(packageBarCode)){
		mes("不符合条码规则");
		document.getElementById("packageBarCode").value = "";
		document.getElementById("packageBarCode").focus();
		return;
	}
	$.ajax({
		url : getRootPath()+"/inspection/package",
		type : "post",
		data : "packageBarCode=" + packageBarCode,
		dataType : "json",
		success : function(data) {
			if (data) {
				document.getElementById("p").play();
				productBarCodes = eval(data);
				$("#size").text("【"+productBarCodes.length+"】");
				for (i = 0; i < productBarCodes.length; i++) {
					$("#left").append("<div>" + productBarCodes[i] + "</div>");
				}
			}
		},
		error : function(err) {
			mes("此中箱条码未录入");
			document.getElementById("packageBarCode").value = "";
			document.getElementById("packageBarCode").focus();
			return;
		}
	})
	document.getElementById("productBarCode").value = "";
	document.getElementById("productBarCode").focus();
}
// 检验产品编码
function inspection() {
	//左边没有子元素
	if ($("#left").children().length==0){
		mes("未找到中箱条码,请稍后再试");
		document.getElementById("packageBarCode").value = "";
		document.getElementById("packageBarCode").focus();
		return;
	}
	var productBarCode = $("#productBarCode").val().trim()
	if (regu.test(productBarCode) || productBarCode == ""
			|| productBarCode == null || productBarCode == undefined) {
		mes("请输入产品编码");
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
	for(i=0;i<codeArray.length; i++){
		if(productBarCode==codeArray[i]){
			mes("产品编码重复");
			document.getElementById("productBarCode").value = "";
			document.getElementById("productBarCode").focus();
			return;
		}
	}
	var newNode = document.createElement("div");
	newNode.innerText = productBarCode;
	for (i = 0; i < productBarCodes.length; i++) {
		if (productBarCode == productBarCodes[i]) {
			document.getElementById("p").play();
			newNode.className = "ok";
			document.getElementById("right").appendChild(newNode);
			document.getElementById("productBarCode").value = "";
			document.getElementById("productBarCode").focus();
			;
			break;
		}
		newNode.className = "ng";
		document.getElementById("right").appendChild(newNode);
		document.getElementById("productBarCode").value = "";
		document.getElementById("productBarCode").focus();
	}
	if(newNode.className == "ng"){
		document.getElementById("f").play();	
	}
	// 添加已检验条码
	codeArray.push(productBarCode);
	// 检验的条码数量
	num++;
	if(num==productBarCodes.length){
		num=0;
		codeArray=[];// 清空数组
		save();// 自动保存
	}
}
// 保存检验记录
function save() {
	var name = $(".name").val().trim();// 检验人
	var packageBarCode = $("#packageBarCode").val().trim();// 卡板编码
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
	if (regu.test(packageBarCode) || packageBarCode == "" || packageBarCode == null
			|| packageBarCode == undefined) {
		mes("请输入中箱编码:");
		return;
	}
	if (regu.test(originalData) || originalData == "" || originalData == null
			|| originalData == undefined) {
		mes("请先点击'检验'按钮");
		return;
	}
	if (regu.test(inspectionData) || inspectionData == ""
			|| inspectionData == null || inspectionData == undefined) {
		mes("请先输入产品编码,按'确定'按钮进行检验");
		return;
	}

	$.ajax({
		url : getRootPath()+"/inspection/save",
		type : "post",
		data : "{\"packageBarCode\" : \""+packageBarCode+"\",\"createName\" : \""+name+"\",\"originalData\" : \""+originalData+"\",\"inspectionData\" : \""+inspectionData+"\",\"inspectionResult\" : \""+inspectionResult+"\"}",
		contentType : "application/json",
		dataType : "json",
		success : function(data) {
			if (data) {
				if (data.code == 500) {
					alert(data.msg);
					window.location.reload();
				} else {
					if(inspectionResult=="NG"){
						document.getElementById("f").play();
						alert("检验记录保存成功，检验结果【"+inspectionResult+"】");
						$(".name").val(data.data);
						$("#left").html("");
						$("#right").html("");
						$("#packageBarCode").val("");
						$("#packageBarCode").focus();
					}else{
					mesOK("检验记录保存成功，检验结果【"+inspectionResult+"】");
					$(".name").val(data.data);
					$("#left").html("");
					$("#right").html("");
					$("#packageBarCode").val("");
					$("#packageBarCode").focus();
					}
				}
			} 
		},
		error:function(e){
			alert("保存检验记录异常");
			window.location.reload();
		}
	})

}


$(document).ready(function() {
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
							$("#packageBarCode").val("");
							$("#packageBarCode").focus();
						}
					}
				});
		
	// packageBarCode回车事件
	$("#packageBarCode").keydown(function(e) {
		var curKey = e.which;
		if (curKey == 13) {
			package();
		}
	});

	// productBarCode回车事件
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
function mes(text){
	document.getElementById("f").play();
	$(".mes").text(text).show();
	setTimeout(function(){$(".mes").hide();},3000);
}
function mesOK(text) {
	document.getElementById("p").play();
	$(".mes").text(text).show();
	setTimeout(function() {
		$(".mes").hide();
	}, 3000);
}