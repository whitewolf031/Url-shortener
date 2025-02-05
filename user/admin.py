from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User
from django.utils.translation import gettext_lazy as _

# Unregister the default UserAdmin
admin.site.unregister(User)

@admin.register(User)
class UserAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'groups')

    # Group fields into sections in the detail view
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        (_('Personal Info'), {'fields': ('first_name', 'last_name', 'email')}),
        (_('Permissions'), {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        (_('Important Dates'), {'fields': ('last_login', 'date_joined')}),
    )

    def formfield_for_dbfield(self, db_field, request, **kwargs):
        field = super().formfield_for_dbfield(db_field, **kwargs)

        if db_field.name == 'username':
            field.label = _('Username')
            field.help_text = _('Required. 150 characters or fewer. Letters, digits, and @/./+/-/_ only.')

        elif db_field.name == 'email':
            field.label = _('Email address')
            field.help_text = _('Enter a valid email address')

        elif db_field.name == 'first_name':
            field.label = _('First name')

        elif db_field.name == 'last_name':
            field.label = _('Last name')

        return field