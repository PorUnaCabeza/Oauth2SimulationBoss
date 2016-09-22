package org.cabeza.oauth2.server.oauth2.vo;

/**
 * Created by zhangxs on 2016/9/22.
 */
public class AuthorizeParam {
    private String serviceCode;
    private String originName;

    public AuthorizeParam() {
    }

    public String getOriginName() {
        return originName;
    }

    public void setOriginName(String originName) {
        this.originName = originName;
    }

    public String getServiceCode() {
        return serviceCode;
    }

    public void setServiceCode(String serviceCode) {
        this.serviceCode = serviceCode;
    }
}
