package org.cabeza.oauth2.server.shiro.exception;

import org.springframework.web.servlet.HandlerExceptionResolver;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Created by Cabeza on 2016-05-28.
 */
public class ShiroExceptionResolver implements HandlerExceptionResolver {

    @Override
    public ModelAndView resolveException(HttpServletRequest request,
                                         HttpServletResponse response, Object handler, Exception ex) {
        System.out.println("cabeza  qwer");

        return new ModelAndView("shiro/unauthor");
    }

}
