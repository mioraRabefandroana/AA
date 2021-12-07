from django.db import router
from django.urls import path, include
from api.models import BadgeArtiste, BadgeFan


from rest_framework import routers
from api.views import ArtisteViewSet, BadgeArtisteViewSet, BadgeFanViewSet, CreateUserView, RegisterView, TestViewSet, UserAuthentificationView, UtilisateurByTokenView, UtilisateurViewSet, AdministrateurViewSet, ContenuViewSet, DevenirMembreViewSet, FanClubViewSet, PageViewSet, PublicationViewSet, ValidationEmailViewSet

router = routers.DefaultRouter()
router.register('utilisateur', UtilisateurViewSet)
router.register('artiste', ArtisteViewSet)
router.register('administrateur', AdministrateurViewSet)
router.register('publication', PublicationViewSet)
router.register('page', PageViewSet)
router.register('fanclub', FanClubViewSet)
router.register('badge/artiste', BadgeArtisteViewSet)
router.register('badge/fan', BadgeFanViewSet)
router.register('validationemail', ValidationEmailViewSet)
router.register('test', TestViewSet)

#>> TODO : à enlever après dévéloppement complet
router.register('devenirmembre', DevenirMembreViewSet)
router.register('contenu', ContenuViewSet)

urlpatterns = [
    path('user/login', UserAuthentificationView.as_view(), name="api_user_login"),
    # path('user/register', CreateUserView.as_view(), name="api_user_register"),
    path('user/register', RegisterView.as_view(), name="api_user_register"),
    path('user/token/', UtilisateurByTokenView.as_view(), name="api_get_user_by_token"),
]


# urlpatterns = [
#     path('', views.index, name='index'),
#     path('hello', views.hello, name='hello'),
# ]