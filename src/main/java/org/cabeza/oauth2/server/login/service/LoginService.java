package org.cabeza.oauth2.server.login.service;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.subject.Subject;
import org.cabeza.oauth2.server.common.bean.Result;
import org.cabeza.oauth2.server.login.bean.LoginInfo;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpSession;

/**
 * Created by admin on 2016/2/17.
 */
@Service
public class LoginService {
    public Result checkLogin(LoginInfo loginInfo,HttpSession session){
        Subject subject=SecurityUtils.getSubject();
        UsernamePasswordToken token=new UsernamePasswordToken(loginInfo.getUsername(),loginInfo.getPassword());
        try{
            subject.login(token);
            return Result.build("1", "");
        }catch (AuthenticationException e){
            return Result.build("0","");
        }
    }
}
