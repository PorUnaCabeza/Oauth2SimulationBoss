package org.cabeza.oauth2.server.oauth2.service;

import org.cabeza.oauth2.server.common.bean.Collections;
import org.n3r.eql.Eql;
import org.springframework.stereotype.Service;

/**
 * Created by zhangxs on 2016/9/21.
 */
@Service
public class Oauth2Service {

    public String getRedirectUrl(String serviceCode) {
        return new Eql()
                .selectFirst("getRedirectUrl")
                .returnType(String.class)
                .params(Collections.asMap("serviceCode", serviceCode))
                .execute();
    }
}
