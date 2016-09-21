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
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
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
    @RequestMapping("authorize")
    public Object authorize(
            Model model,
            HttpServletRequest request)
            throws URISyntaxException, OAuthSystemException {
        try {
            //构建OAuth 授权请求
            OAuthAuthzRequest oauthRequest = new OAuthAuthzRequest(request);

            System.out.println("client id:" + oauthRequest.getClientId());

            //生成授权码
            String authorizationToken = null;
            //TOKEN
            String responseType = oauthRequest.getParam(OAuth.OAUTH_RESPONSE_TYPE);
            if (responseType.equals(ResponseType.TOKEN.toString())) {
                OAuthIssuerImpl oauthIssuerImpl = new OAuthIssuerImpl(new MD5Generator());
                authorizationToken = oauthIssuerImpl.accessToken();
                Jedis jedis= JedisUtil.getJedis();
                jedis.setex("oauth:"+authorizationToken,60,SecurityUtils.getSubject().getPrincipal().toString());
                JedisUtil.returnResource(jedis);
                //添加至redis
            }

            //进行OAuth响应构建
            OAuthASResponse.OAuthAuthorizationResponseBuilder builder =
                    OAuthASResponse.authorizationResponse(request, HttpServletResponse.SC_FOUND);
            //设置授权码
            builder.setAccessToken(authorizationToken);

            //得到到客户端重定向地址
            String redirectURI = oauthRequest.getParam(OAuth.OAUTH_REDIRECT_URI);

            String verifyUrl=request.getRequestURI();
            verifyUrl=verifyUrl.substring(0,verifyUrl.lastIndexOf("/"))+"/accessToken";
            //构建响应
            final OAuthResponse response = builder.location(redirectURI).buildQueryMessage();
            //根据OAuthResponse返回ResponseEntity响应
            HttpHeaders headers = new HttpHeaders();
            headers.setLocation(new URI(response.getLocationUri()));
            return "redirect:"+redirectURI+"?access_token="+authorizationToken+"&verify_url="+verifyUrl;
        } catch (OAuthProblemException e) {

            //出错处理
            String redirectUri = e.getRedirectUri();
            if (OAuthUtils.isEmpty(redirectUri)) {
                //告诉客户端没有传入redirectUri直接报错
                return new ResponseEntity("OAuth callback url needs to be provided by client!!!", HttpStatus.NOT_FOUND);
            }

            //返回错误消息（如?error=）
            final OAuthResponse response =
                    OAuthASResponse.errorResponse(HttpServletResponse.SC_FOUND)
                            .error(e).location(redirectUri).buildQueryMessage();
            HttpHeaders headers = new HttpHeaders();
            headers.setLocation(new URI(response.getLocationUri()));
            return new ResponseEntity(headers, HttpStatus.valueOf(response.getResponseStatus()));
        }
    }

    @ResponseBody
    @RequestMapping("accessToken/{token}")
    public Map accessToken(@PathVariable String token){
        Jedis jedis= JedisUtil.getJedis();
        String user=jedis.get("oauth:" + token);
        JedisUtil.returnResource(jedis);
        int result=1;
        if (user==null)
            result=0;
        return Collections.asMap("access",result,"user",user);
    }

}
