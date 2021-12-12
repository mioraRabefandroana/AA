"""aaserver URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.db import router
from django.urls import path, include
from api import views
from rest_framework import routers
from rest_framework.authtoken import views
# from . import api
from django.conf import settings
from django.views.static import serve
from django.conf.urls import include, url

from api.urls import router as api_router

router = routers.DefaultRouter()
router.registry.extend(api_router.registry)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('user/', include('dj_rest_auth.urls')),
    # path('user/token/', views.obtain_auth_token), # get user by passed token
    path('api/', include('api.urls')),
    path('', include(router.urls)),
    url(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT,})
]
