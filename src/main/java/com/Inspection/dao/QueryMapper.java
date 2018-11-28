package com.Inspection.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

public interface QueryMapper {
	public List<String> queryByTray(@Param("TrayBarCode") String TrayBarCode);

	public List<String> queryByPackage(@Param("PackageBarCode") String PackageBarCode);

	public String queryByBox(@Param("boxBarCode") String boxBarCode);
}
