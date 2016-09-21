package org.cabeza.oauth2.server.shiro.service;

import org.cabeza.oauth2.server.common.bean.Collections;
import org.cabeza.oauth2.server.common.bean.Result;
import org.cabeza.oauth2.server.shiro.bean.Permission;
import org.cabeza.oauth2.server.shiro.bean.Role;
import org.cabeza.oauth2.server.shiro.bean.User;
import org.n3r.eql.Eql;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Created by Cabeza on 2016/5/9.
 */
@Service
public class ShiroService {
    public User getByUserName(String username) {
        return new Eql().selectFirst("getByUserName").params(Collections.asMap("username",username)).returnType(User.class).execute();
    }
    public Set<String> findRoles(String username) {
        List<String> list=new Eql().params(Collections.asMap("username",username)).returnType(String.class).execute();
        return new HashSet<String>(list);
    }

    public Set<String> findPermissions(String username) {
        List<String> list=new Eql().params(Collections.asMap("username",username)).returnType(String.class).execute();
        return new HashSet<String>(list);
    }
}
