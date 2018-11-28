package com.Inspection.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Inspection.dao.QueryMapper;
import com.Inspection.service.QueryService;

@Service
public class QueryServiceImpl implements QueryService {
	@Autowired
	private QueryMapper queryMapper;

	@Override
	public List<String> queryByTray(String TrayBarCode) {
		return queryMapper.queryByTray(TrayBarCode);
	}

	@Override
	public List<String> queryByPackage(String PackageBarCode) {
		return queryMapper.queryByPackage(PackageBarCode);
	}

	@Override
	public String queryByBox(String boxBarCode) {
		return queryMapper.queryByBox(boxBarCode);
	}

}
