from django.db import router
from django.urls import path, include
from api.models import ArtistBadge, FanBadge


from rest_framework import routers
from api.views import ArtistViewSet, ArtistBadgeViewSet, CoverPictureUploadView, FanBadgeViewSet, CreateUserView, FanViewSet, NewPublicationView, ProfilePictureUploadView, PublicationsGetter, RegisterView, TestViewSet, UserAuthentificationView, AAUserByTokenView, AAUserViewSet, AdministratorViewSet, ContentViewSet, BecomeMemberViewSet, FanClubViewSet, PageViewSet, PublicationViewSet, EmailValidationViewSet

router = routers.DefaultRouter()
router.register('aauser', AAUserViewSet)
router.register('artist', ArtistViewSet)
router.register('fan', FanViewSet)
router.register('administrator', AdministratorViewSet)
router.register('publication', PublicationViewSet)
router.register('page', PageViewSet)
router.register('fanclub', FanClubViewSet)
router.register('badge/artist', ArtistBadgeViewSet)
router.register('badge/fan', FanBadgeViewSet)
router.register('validationemail', EmailValidationViewSet)
router.register('test', TestViewSet)

#>> TODO : à enlever après dévéloppement complet
router.register('becomemember', BecomeMemberViewSet)
router.register('content', ContentViewSet)

urlpatterns = [
    path('user/login/', UserAuthentificationView.as_view(), name="api_user_login"),
    # path('user/register', CreateUserView.as_view(), name="api_user_register"),
    path('user/register/', RegisterView.as_view(), name="api_user_register"),
    path('user/token/', AAUserByTokenView.as_view(), name="api_get_user_by_token"),
    path('user/upload/cover/', CoverPictureUploadView.as_view(), name="api_cover_picture_upload"),
    path('user/upload/profile/', ProfilePictureUploadView.as_view(), name="api_profile_picture_upload"),
    path('publications/', PublicationsGetter.as_view(), name="api_publication_getter"),
    path('publication/new/', NewPublicationView.as_view(), name="api_new_publication"),
]


# urlpatterns = [
#     path('', views.index, name='index'),
#     path('hello', views.hello, name='hello'),
# ]