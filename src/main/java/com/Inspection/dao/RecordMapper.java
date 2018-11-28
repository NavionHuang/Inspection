package com.Inspection.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

import com.Inspection.pojo.InspectionRecord;

public interface RecordMapper {
	public int save(InspectionRecord inspectionRecord);

	public List<InspectionRecord> query(@Param("ir") InspectionRecord inspectionRecord,
			@Param("page") Integer page, @Param("pageSize") Integer pageSize);
	public Map<String,String> queryByPoAndProductSpec(@Param("ir") InspectionRecord inspectionRecord);
}
