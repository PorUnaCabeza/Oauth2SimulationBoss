package org.cabeza.oauth2.server.shiro.controller;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.apache.shiro.session.Session;
import org.apache.shiro.subject.Subject;
import org.cabeza.oauth2.server.common.bean.Result;
import org.cabeza.oauth2.server.shiro.bean.Permission;
import org.cabeza.oauth2.server.shiro.bean.Role;
import org.cabeza.oauth2.server.shiro.bean.User;
import org.cabeza.oauth2.server.shiro.service.ShiroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Created by Cabeza on 2016/5/10.
 */
@Controller
@RequestMapping("shiro")
public class ShiroController {

}
