package org.cabeza.oauth2.server.oauth2.domain;

/**
 * Created by zhangxs on 2016/9/22.
 */
public class Token {
    private String redirectUrl;
    private String accessToken;
    private String origin;

    public Token() {
    }

    public Token(String redirectUrl, String accessToken, String origin) {
        this.redirectUrl = redirectUrl;
        this.accessToken = accessToken;
        this.origin = origin;
    }

    public String getRedirectUrl() {
        return redirectUrl;
    }

    public void setRedirectUrl(String redirectUrl) {
        this.redirectUrl = redirectUrl;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getOrigin() {
        return origin;
    }

    public void setOrigin(String origin) {
        this.origin = origin;
    }
}
