package com.Inspection.controller;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.jboss.logging.Param;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.Inspection.pojo.InspectionRecord;
import com.Inspection.service.QueryService;
import com.Inspection.service.RecordService;
import com.Inspection.uitl.Result;

@Controller
@RequestMapping("/inspection")
public class InspectionController {
	@Autowired
	private QueryService queryService;
	@Autowired
	private RecordService RecordService;

	@RequestMapping("/tray")
	@ResponseBody
	public List<String> queryByTray(String trayBarCode) {
		if (null == trayBarCode || "".equals(trayBarCode)) {
			return null;
		}
		List<String> packageBarCodes = new ArrayList<>();
		packageBarCodes = queryService.queryByTray(trayBarCode);
		if (packageBarCodes.size() > 0) {
			return packageBarCodes;
		} else {
			return null;
		}
	}

	@RequestMapping("/box")
	@ResponseBody
	public String queryByBox(String boxBarCode) {
		if (null == boxBarCode || "".equals(boxBarCode)) {
			return null;
		}
		return queryService.queryByBox(boxBarCode);
	}

	@RequestMapping("/package")
	@ResponseBody
	public List<String> packages(String packageBarCode) {
		if (null == packageBarCode || "".equals(packageBarCode)) {
			return null;
		}
		List<String> productBarCodes = new ArrayList<>();
		productBarCodes = queryService.queryByPackage(packageBarCode);
		if (productBarCodes.size() > 0) {
			return productBarCodes;
		} else {
			return null;
		}
	}

	@RequestMapping("/save")
	@ResponseBody
	public Result save(@RequestBody InspectionRecord inspectionRecord) throws ParseException {
		if (null == inspectionRecord) {
			return Result.error("请输入完整参数");
		} else if (null == inspectionRecord.getCreateName() || "".equals(inspectionRecord.getCreateName())) {
			return Result.error("请输入检测人");
		} else if (null == inspectionRecord.getOriginalData() || "".equals(inspectionRecord.getOriginalData())) {
			return Result.error("请先点击'检验'按钮");
		} else if (null == inspectionRecord.getInspectionData() || "".equals(inspectionRecord.getInspectionData())) {
			Result.error("请先输入中箱/产品编码,按'确定'按钮进行检验");
		} else if ((null == inspectionRecord.getPackageBarCode() || "".equals(inspectionRecord.getPackageBarCode()))
				&& (null == inspectionRecord.getBoxBarCode() || "".equals(inspectionRecord.getBoxBarCode()))
				&& (null == inspectionRecord.getTrayBarCode() || "".equals(inspectionRecord.getTrayBarCode()))) {
			return Result.error("请输入需要检验的条码");
		}
		String date = new SimpleDateFormat("yyyy-MM-dd").format(new Date());
		inspectionRecord.setCreateTime(date);
		// 查询PO和productSpec
		Map<String, String> map = RecordService.queryByPoAndProductSpec(inspectionRecord);
		inspectionRecord.setPo(map.get("po"));
		inspectionRecord.setProductSpec(map.get("productSpec"));
		// 保存检验记录
		int num = RecordService.save(inspectionRecord);
		if (num > 0) {
			Result result = new Result();
			result.setCode(200);
			result.setMsg("检验记录已保存");
			result.setData(inspectionRecord.getCreateName());
			return result;
		} else {
			return Result.error("操作失败");
		}
	}

	@RequestMapping("/list")
	public ModelAndView list(InspectionRecord inspectionRecord,
			@RequestParam(value = "page", defaultValue = "1") Integer page) {
		int pageSize = 12;
		ModelAndView mv = new ModelAndView();
		List<InspectionRecord> recordList = new ArrayList<>();
		recordList = RecordService.query(inspectionRecord, page, pageSize);
		mv.setViewName("list");
		mv.addObject("page", page);
		mv.addObject("recordList", recordList);
		mv.addObject("hx", inspectionRecord);
		return mv;
	}
}
