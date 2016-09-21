package org.cabeza.oauth2.server.login.interceptor;

import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class LoginInterceptor implements HandlerInterceptor{

	@Override
	public void afterCompletion(HttpServletRequest arg0,
			HttpServletResponse arg1, Object arg2, Exception arg3)
			throws Exception {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void postHandle(HttpServletRequest arg0, HttpServletResponse arg1,
			Object arg2, ModelAndView arg3) throws Exception {
		// TODO Auto-generated method stub
		
	}

	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response,
			Object arg2) throws Exception {
		/*System.out.println(request.getContextPath());
		System.out.println(request.getRequestURI());
		System.out.println(request.getAttribute("id"));
		System.out.println(request.getParameter("id"));*/
		if(request.getSession().getAttribute("username")==null){
			response.sendRedirect("login");
			return false;
		}
		return true;
	}

}
