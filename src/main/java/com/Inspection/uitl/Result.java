package com.Inspection.uitl;

import com.Inspection.pojo.InspectionRecord;

public class Result {
	private int code;
	private String msg;
	private Object data;

	public static Result ok() {
		Result result = new Result();
		result.setCode(200);
		return result;
	}

	public static Result error(String msg) {
		Result result = new Result();
		result.setCode(500);
		result.setMsg(msg);
		return result;
	}

	public int getCode() {
		return code;
	}

	public void setCode(int code) {
		this.code = code;
	}

	public String getMsg() {
		return msg;
	}

	public void setMsg(String msg) {
		this.msg = msg;
	}

	public Object getData() {
		return data;
	}

	public void setData(Object data) {
		this.data = data;
	}

}
