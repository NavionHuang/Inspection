package com.Inspection.service;

import java.util.List;

import org.apache.ibatis.annotations.Param;

public interface QueryService {
	public List<String> queryByTray(String TrayBarCode);

	public List<String> queryByPackage(String PackageBarCode);

	public String queryByBox(String boxBarCode);
}
