from rest_framework import permissions


class IsOrganizationEditorOrDisallow(permissions.IsAuthenticatedOrReadOnly):
    """
    Object-level read permission to users in the object's organization

    Assumes the model instance has an `organization` foreign key or a
    `video` foreign key with such a connection.
    """
    def has_object_permission(self, request, view, obj):
        # Anonymous are always disallowed
        if not request.user.is_authenticated:
            return False
        # Staff are allowed to change everything
        if request.user.is_staff:
            return True
        # We expect either the object to have an organization directly
        # or have a video field with an organization.
        try:
            organization_id = obj.organization_id
        except AttributeError:
            organization_id = obj.video.organization_id
        # User must be editor of organization to do changes
        return (
            request.user.editor.filter(id=organization_id).exists())


class IsOrganizationEditorOrReadOnly(IsOrganizationEditorOrDisallow):
    """
    Object-level edit permission to users in the object's organization
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        return super(IsOrganizationEditorOrReadOnly, self).has_object_permission(
            request, view, obj)


class IsInOrganizationOrDisallow(permissions.IsAuthenticatedOrReadOnly):
    """
    Object-level read permission to users in the object's organization

    Assumes the model instance has an `organization` foreign key or a
    `video` foreign key with such a connection.
    """
    def has_object_permission(self, request, view, obj):
        # Anonymous are always disallowed
        if not request.user.is_authenticated:
            return False
        # Staff are allowed to change everything
        if request.user.is_staff:
            return True
        # We expect either the object to have an organization directly
        # or have a video field with an organization.
        try:
            organization = obj.organization
        except AttributeError:
            organization = obj.video.organization
        # User must be part of organization to do changes
        return (
            organization.editor == request.user or
            organization in request.user.organization_set.all()
            )


class IsInOrganizationOrReadOnly(IsInOrganizationOrDisallow):
    """
    Object-level edit permission to users in the object's organization
    """

    def has_object_permission(self, request, view, obj):
        if request.user.is_staff:
            return True
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        return super(IsInOrganizationOrReadOnly, self).has_object_permission(
            request, view, obj)


class IsStaffOrReadOnly(permissions.BasePermission):
    """
    The request user is staff, or is a read-only request.
    """

    def has_permission(self, request, view):
        return (
            request.method in permissions.SAFE_METHODS or
            request.user and request.user.is_staff
        )
