from django.db import router
from django.urls import path, include
from api.models import ArtistBadge, FanBadge, Subscribe


from rest_framework import routers
from api.views import ArtistViewSet, ArtistBadgeViewSet, CommentPubicationView, CoverPictureUploadView, FanBadgeViewSet, CreateUserView, FanViewSet, LikePubicationView, LikeViewSet, NewPublicationView, ProfilePictureUploadView, PublicPublicationsGetterView, RegisterView, SubscribeView, TestViewSet, UnSubscribeView, UnlikePubicationView, UserAuthentificationView, AAUserByTokenView, AAUserViewSet, AdministratorViewSet, ContentViewSet, BecomeMemberViewSet, FanClubViewSet, PageViewSet, PublicationViewSet, EmailValidationViewSet, UserPublicationViewSet

router = routers.DefaultRouter()
router.register('aauser', AAUserViewSet)
router.register('artist', ArtistViewSet)
router.register('fan', FanViewSet)
router.register('administrator', AdministratorViewSet)
router.register('publication', PublicationViewSet)
router.register('userpublication', UserPublicationViewSet)
router.register('page', PageViewSet)
router.register('fanclub', FanClubViewSet)
router.register('badge/artist', ArtistBadgeViewSet)
router.register('badge/fan', FanBadgeViewSet)
router.register('validationemail', EmailValidationViewSet)


router.register('test', TestViewSet)

router.register('like', LikeViewSet)

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
    path('publications/', PublicPublicationsGetterView.as_view(), name="api_publication_getter"),
    path('publication/new/', NewPublicationView.as_view(), name="api_new_publication"),
    path('publication/like/', LikePubicationView.as_view(), name="api_like_a_publication"),
    path('publication/unlike/', UnlikePubicationView.as_view(), name="api_unlike_a_publication"),
    path('publication/comment/', CommentPubicationView.as_view(), name="api_comment_a_publication"),
    path('user/subscribe/', SubscribeView.as_view(), name="api_comment_a_publication"),
    path('user/unsubscribe/', UnSubscribeView.as_view(), name="api_comment_a_publication"),
]


# urlpatterns = [
#     path('', views.index, name='index'),
#     path('hello', views.hello, name='hello'),
# ]