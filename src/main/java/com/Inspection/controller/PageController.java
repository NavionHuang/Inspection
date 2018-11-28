package com.Inspection.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class PageController {
	
	@RequestMapping("/")
    public String index() {
        return "index";
    }
	@RequestMapping("/tray.html")
	public String tray() {
        return "tray";
    }
	@RequestMapping("/package.html")
	public String packages() {
		return "package";
	}
	@RequestMapping("/box.html")
	public String box() {
		return "box";
	}
	@RequestMapping("/list.html")
	public String list() {
		return "redirect:/inspection/list";
	}
}
