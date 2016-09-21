package org.cabeza.oauth2.server.shiro.bean;

/**
 * Created by Cabeza on 2016/5/10.
 */
public class Permission {
    private String id;
    private String permission;
    private String parentId;
    private String description;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPermission() {
        return permission;
    }

    public void setPermission(String permission) {
        this.permission = permission;
    }

    public String getParentId() {
        return parentId;
    }

    public void setParentId(String parentId) {
        this.parentId = parentId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public String toString() {
        return "Permission{" +
                "id='" + id + '\'' +
                ", permission='" + permission + '\'' +
                ", parentId='" + parentId + '\'' +
                ", description='" + description + '\'' +
                '}';
    }
}
