package com.Inspection.pojo;

import java.util.Date;

import org.springframework.format.annotation.DateTimeFormat;

public class InspectionRecord {
	private Integer id;
	private String packageBarCode;// 中箱编码
	private String trayBarCode;// 卡板编码
	private String createTime;// 检验时间
	private String createName;// 检验人
	private String inspectionData;// 检验数据
	private String originalData;// 原始数据
	private String inspectionResult;// 检验结果
	//private String productBarCode;// 产品编码
	private String po;//工单号
	private String productSpec;//产品型号
	private String boxBarCode;//彩盒条码
	
	public String getBoxBarCode() {
		return boxBarCode;
	}

	public void setBoxBarCode(String boxBarCode) {
		this.boxBarCode = boxBarCode;
	}

	public String getPo() {
		return po;
	}

	public void setPo(String po) {
		this.po = po;
	}

	public String getProductSpec() {
		return productSpec;
	}

	public void setProductSpec(String productSpec) {
		this.productSpec = productSpec;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getPackageBarCode() {
		return packageBarCode;
	}

	public void setPackageBarCode(String packageBarCode) {
		this.packageBarCode = packageBarCode;
	}

	public String getTrayBarCode() {
		return trayBarCode;
	}

	public void setTrayBarCode(String trayBarCode) {
		this.trayBarCode = trayBarCode;
	}

	public String getCreateTime() {
		return createTime;
	}

	public void setCreateTime(String createTime) {
		this.createTime = createTime;
	}

	public String getCreateName() {
		return createName;
	}

	public void setCreateName(String createName) {
		this.createName = createName;
	}

	public String getInspectionData() {
		return inspectionData;
	}

	public void setInspectionData(String inspectionData) {
		this.inspectionData = inspectionData;
	}

	public String getOriginalData() {
		return originalData;
	}

	public void setOriginalData(String originalData) {
		this.originalData = originalData;
	}

	public String getInspectionResult() {
		return inspectionResult;
	}

	public void setInspectionResult(String inspectionResult) {
		this.inspectionResult = inspectionResult;
	}

}
