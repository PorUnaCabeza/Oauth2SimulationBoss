package org.cabeza.oauth2.server.oauth2.domain;

/**
 * Created by zhangxs on 2016/9/22.
 */
public class TokenResult {
    private String access;
    private String ownerId;
    private String message;

    public TokenResult() {
    }

    public TokenResult(String access, String ownerId) {
        this.access = access;
        this.ownerId = ownerId;
    }

    public TokenResult(String access, String ownerId, String message) {
        this.access = access;
        this.ownerId = ownerId;
        this.message = message;
    }

    public static TokenResult build(String access, String ownerId) {
        return new TokenResult(access, ownerId);
    }

    public static TokenResult build(String access, String ownerId, String message) {
        return new TokenResult(access, ownerId, message);
    }

    public String getAccess() {
        return access;
    }

    public void setAccess(String access) {
        this.access = access;
    }

    public String getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(String ownerId) {
        this.ownerId = ownerId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
