package com.Inspection.service;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

import com.Inspection.pojo.InspectionRecord;

public interface RecordService {
	public int save(InspectionRecord inspectionRecord);

	public List<InspectionRecord> query(InspectionRecord inspectionRecord, Integer page, Integer pageSize);

	public Map<String, String> queryByPoAndProductSpec(InspectionRecord inspectionRecord);
}
