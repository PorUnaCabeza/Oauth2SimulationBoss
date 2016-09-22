package org.cabeza.oauth2.server.oauth2.controller;

import org.apache.oltu.oauth2.as.issuer.MD5Generator;
import org.apache.oltu.oauth2.as.issuer.OAuthIssuerImpl;
import org.apache.oltu.oauth2.common.exception.OAuthSystemException;
import org.apache.oltu.oauth2.common.utils.OAuthUtils;
import org.apache.shiro.SecurityUtils;
import org.cabeza.oauth2.server.common.bean.Result;
import org.cabeza.oauth2.server.common.util.JedisUtil;
import org.cabeza.oauth2.server.oauth2.domain.Token;
import org.cabeza.oauth2.server.oauth2.domain.TokenResult;
import org.cabeza.oauth2.server.oauth2.service.Oauth2Service;
import org.cabeza.oauth2.server.oauth2.vo.AuthorizeParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import redis.clients.jedis.Jedis;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by Cabeza on 2016/9/18.
 */
@Controller
@RequestMapping("/cabeza-oauth-server/v1")
public class Oauth2Controller {
    @Autowired
    Oauth2Service oauth2Service;

    @RequestMapping("authorize")
    public Object authorize(HttpServletRequest request) {

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
    @RequestMapping("authorize-rest")
    public Result authorizeRest(@RequestBody AuthorizeParam authorizeParam) {
        //得到业务码
        String serviceCode = authorizeParam.getServiceCode();
        //根据业务码得到重定向地址
        String redirectUrl = oauth2Service.getRedirectUrl(serviceCode);
        if (OAuthUtils.isEmpty(redirectUrl)) {
            //没有redirectUri直接报错
            return Result.build("002", "没有回调url");
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


        Token token = new Token(redirectUrl, authorizationToken, authorizeParam.getOriginName());
        return Result.build("000", "生成授权信息成功", token);
    }

    @ResponseBody
    @RequestMapping("check-token")
    public TokenResult checkToken(@RequestBody String token) {
        Jedis jedis = JedisUtil.getJedis();
        String user = jedis.get("boss:token:" + token);
        JedisUtil.returnResource(jedis);
        int result = 1;
        if (user == null)
            result = 0;
        return TokenResult.build(result + "", user);
    }

}
