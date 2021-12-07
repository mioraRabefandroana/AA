from django.shortcuts import render

from django.http import HttpResponse, response
from rest_framework import viewsets, views
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from api.custom_exceptions import CustomApiException
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import api_view

from rest_framework import permissions
from rest_framework.generics import CreateAPIView
from django.contrib.auth import get_user_model
from api.serializer import UserSerializer, ValidationEmailSerializer
from rest_framework import serializers
from django.contrib.auth.models import User

from api.models import Artiste, BadgeArtiste, BadgeFan, Contenu, DevenirMembre, Fan, FanClub, Page, Publication, Test, TypeArtiste, UserAuthentification, Utilisateur, Administrateur, ValidationEmail
from api.serializer import AdministrateurSerializer, ArtisteSerializer, BadgeArtisteSerializer, BadgeFanSerializer, ContenuSerializer, DevenirMembreSerializer, FanClubSerializer, PageSerializer, PublicationSerializer, TestSerializer, TypeArtisteSerializer, UserAuthentificationSerializer, UtilisateurSerializer

# from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
import django_filters


# class ModelFilter(django_filters.FilterSet):
#     username = django_filters.ModelChoiceFilter(
#         field_name="user__username",
#         queryset=User.objects.all()
#     )

#     class Meta:
#         model = Utilisateur
#         fields = ('username',)


class UtilisateurViewSet(viewsets.ModelViewSet):
    queryset = Utilisateur.objects.all()
    # print('------------------------------------------------')
    # print(queryset[0].user)
    # print('------------------------------------------------')
    serializer_class = UtilisateurSerializer
    # filter_class = ModelFilter

    # permissions
    permission_classes = (IsAuthenticated,)

    filterset_fields  = ['id','nom', 'prenom', 'user__username']
    filter_backends = [DjangoFilterBackend]

    search_fields = ['nom']


class ArtisteViewSet(viewsets.ModelViewSet):
    queryset = Artiste.objects.all()
    serializer_class = ArtisteSerializer

    filterset_fields  = ['nom_d_artiste']
    filter_backends = [DjangoFilterBackend]


class TestViewSet(viewsets.ModelViewSet):
    queryset = Test.objects.all()
    serializer_class = TestSerializer

    # filterset_fields  = ['x']
    filter_backends = [DjangoFilterBackend]


class BadgeArtisteViewSet(viewsets.ModelViewSet):
    queryset = BadgeArtiste.objects.all()
    serializer_class = BadgeArtisteSerializer


class BadgeFanViewSet(viewsets.ModelViewSet):
    queryset = BadgeFan.objects.all()
    serializer_class = BadgeFanSerializer



class AdministrateurViewSet(viewsets.ModelViewSet):
    queryset = Administrateur.objects.all()
    serializer_class = AdministrateurSerializer

    # permissions
    permission_classes = (IsAuthenticated,)


class PublicationViewSet(viewsets.ModelViewSet):
    queryset = Publication.objects.all()
    serializer_class = PublicationSerializer

    # permissions
    permission_classes = (IsAuthenticated,)


class PageViewSet(viewsets.ModelViewSet):
    queryset = Page.objects.all()
    serializer_class = PageSerializer
    
    # permissions
    permission_classes = (IsAuthenticated,)


class FanClubViewSet(viewsets.ModelViewSet):
    queryset = FanClub.objects.all()
    serializer_class = FanClubSerializer

    # permissions
    permission_classes = (IsAuthenticated,)

#>> TODO : voir si DevenirMembre sera afficher ou pas à la fin
class DevenirMembreViewSet(viewsets.ModelViewSet):
    queryset = DevenirMembre.objects.all()
    serializer_class = DevenirMembreSerializer

    # permissions
    permission_classes = (IsAuthenticated,)


#>> TODO : voir si Contenu sera afficher ou pas à la fin
class ContenuViewSet(viewsets.ModelViewSet):
    queryset = Contenu.objects.all()
    serializer_class = ContenuSerializer

    # permissions
    permission_classes = (IsAuthenticated,)


#>> TODO : voir si TypeArtiste sera afficher ou pas à la fin
class TypeArtisteViewSet(viewsets.ModelViewSet):
    queryset = TypeArtiste.objects.all()
    serializer_class = TypeArtisteSerializer

    # permissions
    permission_classes = (IsAuthenticated,)

class ValidationEmailViewSet(viewsets.ModelViewSet):
    queryset = ValidationEmail.objects.all()
    serializer_class = ValidationEmailSerializer

    # permissions
    # permission_classes = (IsAuthenticated,)
    # filterset_fields  = ['email']
    # filter_backends = [DjangoFilterBackend]


class UserAuthentificationView(views.APIView):
    # permission_classes = (IsAuthenticated,)
    
    def get(self, request):
        return Response({})
        
    def post(self, request):
        print('----------------------------')
        print(request.POST)
        print('----------------------------')
        username = UserAuthentification(request.POST.get('username'))
        password = UserAuthentification(request.POST.get('password'))
        user = UserAuthentification(username, password)
        res = UserAuthentificationSerializer(user, password)
        return Response(res)
            

class RegisterView(views.APIView):

    # def get(self, request):
    #     return Response({"get": "get"})
    
    def user_exists_by_username(self):
        try:
            get_user_model().objects.get(username=self.user.get("username"))
            return True
        except BaseException:
            return False
    
    def user_exists_by_email(self):
        try:
            get_user_model().objects.get(email=self.user.get("email"))
            return True
        except BaseException:
            return False

    def not_valid_field(self, field, message):
        return Response({
            "success": False,
            "field": field, 
            "message": message
        })

    def get_mandatory_fields(self):
        return [
            ("accountType", "type de compte"), 
            ("username", "username"), 
            ("email", "email"), 
            ("nom", "nom"), 
            ("prenom", "prenom"), 
            ("sexe", "sexe"),
            ("adresse","adresse"),
            ("tel","téléphone"),
            ("date_de_naissance","date de naissance"),
            ("lieu_de_naissance", "lieu de naissance"),
            ("password", "mot de passe"),
            ("passwordConfirm", "confirmation mot de passe")
        ]
    
    def createFan(self, utilisateur):
        fan = Fan()
        fan.utilisateur = utilisateur
        fan.save()

    def createArtiste(self, utilisateur):
        artiste = Artiste()
        artiste.utilisateur = utilisateur
        artiste.save()

    # create user (sys table)
    def create_user(self):        
        # create user (django admin)
        newUser = User.objects.create_user(
            self.user.get("username"), 
            self.user.get("email"), 
            self.user.get("password")
        )
        # clear permissions : do not give permission yet : waiting for email validation
        # newUser.user_permissions.clear()

        # disable account new user first : wait for email validation
        newUser.is_active = False
        newUser.save()

        print("user active : ", newUser.is_active)

        # create user (api table : Utilisateur)
        utilisateur = Utilisateur()
        utilisateur.user = newUser
        utilisateur.nom = self.user.get("nom")
        utilisateur.prenom = self.user.get("prenom")
        utilisateur.sexe = self.user.get("sexe")
        utilisateur.email = self.user.get("email")
        utilisateur.tel = self.user.get("tel")
        utilisateur.adresse = self.user.get("adresse")
        utilisateur.date_de_naissance = self.user.get("date_de_naissance")
        utilisateur.lieu_de_naissance = self.user.get("lieu_de_naissance")
        utilisateur.save()

        #create specific account for the user
        if self.user.get("accountType") == "fan":
            self.createFan(utilisateur)
        if self.user.get("accountType") == "artiste":
            self.createArtiste(utilisateur)

        return utilisateur


    def active_utilisateur(self, utilisateur):
        utilisateur.user.is_active = True
        utilisateur.user.save()

    def post(self, request):
        self.user = request.data

        print(">>>", self.user) # DEBUG

        # mandatory fields control
        madatory_fields = self.get_mandatory_fields()
        for field in madatory_fields:
            if field[0] not in self.user or self.user[field[0]] is None or self.user[field[0]].strip() == "":
                message = field[1]+" est requis."
                return self.not_valid_field(field[0], message)
        
        # username control
        if self.user_exists_by_username():
            message = "ce nom d'utilisateur est déjà prise"
            return self.not_valid_field("username", message)
        
        # email adress control
        if self.user_exists_by_email():
            message = "un compte est déjà associé à cet email"
            return self.not_valid_field("email", message)
        
        # password confirmation control
        if self.user.get("password") != self.user.get("passwordConfirm"):
            return self.not_valid_field("password", "les mots de passe ne correspondent pas")

        # create user
        utilisateur = self.create_user()

        validation = ValidationEmail()
        validation.set_utilisateur(utilisateur)
        validation.save()
        validation.send_validation_code()

        # activate user account : temporarily
        # in future it will be activated after email validation
        self.active_utilisateur(utilisateur)

        print(' after activation : ', utilisateur.user.is_active)



        return Response({
            "success": True
        }) 


# get user by token
class UtilisateurByTokenView(views.APIView):
    utilisateurUrl = '/utilisateur/?user__username='
    def utilisateur_url(self, username):
        return self.utilisateurUrl+username

    def post(self, request):
        try:
            token = request.data.get("token")
            user = Token.objects.get(key=token).user
            return response.HttpResponseRedirect(redirect_to= self.utilisateur_url(user.username))
        except Exception:
            return Response([])


######################################################
class CreateUserView(CreateAPIView):

    model = get_user_model()
    permission_classes = [
        permissions.AllowAny # Or anon users can't register
    ]
    serializer_class = UserSerializer



####################################################
def index(request):
    return HttpResponse("Hello, world.")


