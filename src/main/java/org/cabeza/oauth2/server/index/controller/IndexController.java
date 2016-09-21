package org.cabeza.oauth2.server.index.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created by admin on 2016/2/20.
 */
@Controller
public class IndexController {
    @RequestMapping(value={"index","/"})
    public String index(){
        return "index/index";
    }

    @RequestMapping("query")
    public String query(){
        return "index/query";
    }

    @RequestMapping("error")
    public String error(){
        return "error/404";
    }
}
