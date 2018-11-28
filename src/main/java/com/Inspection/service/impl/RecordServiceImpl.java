package com.Inspection.service.impl;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Inspection.dao.RecordMapper;
import com.Inspection.pojo.InspectionRecord;
import com.Inspection.service.RecordService;

@Service
public class RecordServiceImpl implements RecordService {
	@Autowired
	private RecordMapper recordMapper;

	@Override
	public int save(InspectionRecord inspectionRecord) {
		return recordMapper.save(inspectionRecord);
	}

	@Override
	public List<InspectionRecord> query(InspectionRecord inspectionRecord, Integer page, Integer pageSize) {
		page = pageSize * (page - 1);
		pageSize = pageSize + page;
		return recordMapper.query(inspectionRecord, page, pageSize);
	}

	@Override
	public Map<String, String> queryByPoAndProductSpec(InspectionRecord inspectionRecord) {
		return recordMapper.queryByPoAndProductSpec(inspectionRecord);
	}

}
