package org.cabeza.oauth2.server.admin.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created by Cabeza on 2016-09-20.
 */
@Controller
@RequestMapping("admin")
public class AdminController {

    @RequestMapping("index")
    public String index(){
        return "admin/index";
    }
}
