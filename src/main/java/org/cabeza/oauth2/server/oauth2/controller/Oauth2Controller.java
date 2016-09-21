package org.cabeza.oauth2.server.oauth2.controller;

import org.apache.oltu.oauth2.as.issuer.MD5Generator;
import org.apache.oltu.oauth2.as.issuer.OAuthIssuerImpl;
import org.apache.oltu.oauth2.as.request.OAuthAuthzRequest;
import org.apache.oltu.oauth2.as.response.OAuthASResponse;
import org.apache.oltu.oauth2.common.OAuth;
import org.apache.oltu.oauth2.common.exception.OAuthProblemException;
import org.apache.oltu.oauth2.common.exception.OAuthSystemException;
import org.apache.oltu.oauth2.common.message.OAuthResponse;
import org.apache.oltu.oauth2.common.message.types.ResponseType;
import org.apache.oltu.oauth2.common.utils.OAuthUtils;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.cabeza.oauth2.server.common.util.Collections;
import org.cabeza.oauth2.server.common.util.JedisUtil;
import org.cabeza.oauth2.server.oauth2.service.Oauth2Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import redis.clients.jedis.Jedis;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Map;

/**
 * Created by Cabeza on 2016/9/18.
 */
@Controller
@RequestMapping("/cabeza-oauth-server/v1")
public class Oauth2Controller {
    @Autowired
    Oauth2Service oauth2Service;

    @RequestMapping("authorize")
    public Object authorize(
            Model model,
            HttpServletRequest request) {

        //得到业务码
        String serviceCode = request.getParameter("service_code");
        //根据业务码得到重定向地址
        String redirectURI = oauth2Service.getRedirectUrl(serviceCode);


        if (OAuthUtils.isEmpty(redirectURI)) {
            //没有redirectUri直接报错
            return new ResponseEntity("OAuth callback url needs to be provided by client!!!", HttpStatus.NOT_FOUND);
        }

        //生成授权码
        String authorizationToken = null;
        OAuthIssuerImpl oauthIssuerImpl = new OAuthIssuerImpl(new MD5Generator());
        try {
            authorizationToken = oauthIssuerImpl.accessToken();
        } catch (OAuthSystemException e) {
            e.printStackTrace();
        }
        //获取用户标识，此处用的shiro
        String userName = SecurityUtils.getSubject().getPrincipal().toString();
        Jedis jedis = JedisUtil.getJedis();
        //token添加至redis,时效10分钟
        jedis.setex("boss:token:" + authorizationToken, 600, userName);
        JedisUtil.returnResource(jedis);

        //使用token和源信息拼接url
        return "redirect:" + redirectURI + "?access_token=" + authorizationToken + "&origin=boss";

    }

    @ResponseBody
    @RequestMapping("check-token/{token}")
    public Map accessToken(@PathVariable String token) {
        Jedis jedis = JedisUtil.getJedis();
        String user = jedis.get("oauth:" + token);
        JedisUtil.returnResource(jedis);
        int result = 1;
        if (user == null)
            result = 0;
        return Collections.asMap("access", result, "user", user);
    }

    @ResponseBody
    @RequestMapping("check-token")
    public Map checkToken(@RequestBody String token) {
        Jedis jedis = JedisUtil.getJedis();
        String user = jedis.get("boss:token:" + token);
        JedisUtil.returnResource(jedis);
        int result = 1;
        if (user == null)
            result = 0;
        return Collections.asMap("access", result, "user", user);
    }

}
