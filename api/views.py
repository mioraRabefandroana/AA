import os
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
from api.serializer import UserSerializer, EmailValidationSerializer
from rest_framework import serializers
from django.contrib.auth.models import User

from api.models import Artist, ArtistBadge, FanBadge, Content, BecomeMember, Fan, FanClub, Page, Publication, Test, ArtistType, UserAuthentification, AAUser, Administrator, EmailValidation
from api.serializer import AdministratorSerializer, ArtistSerializer, ArtistBadgeSerializer, FanBadgeSerializer, ContentSerializer, BecomeMemberSerializer, FanClubSerializer, PageSerializer, PublicationSerializer, TestSerializer, ArtistTypeSerializer, UserAuthentificationSerializer, AAUserSerializer

# from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
import django_filters

from django.contrib.sites.models import Site
from django.core.files import File
from django.conf import settings


# class ModelFilter(django_filters.FilterSet):
#     username = django_filters.ModelChoiceFilter(
#         field_name="user__username",
#         queryset=User.objects.all()
#     )

#     class Meta:
#         model = AAUser
#         fields = ('username',)


class AAUserViewSet(viewsets.ModelViewSet):
    queryset = AAUser.objects.all()
    serializer_class = AAUserSerializer
    # filter_class = ModelFilter

    # permissions
    permission_classes = (IsAuthenticated,)

    filterset_fields  = ['id','name', 'firstName', 'user__username']
    filter_backends = [DjangoFilterBackend]

    search_fields = ['name']


class ArtistViewSet(viewsets.ModelViewSet):
    queryset = Artist.objects.all()
    serializer_class = ArtistSerializer

    filterset_fields  = ['stageName']
    filter_backends = [DjangoFilterBackend]


class TestViewSet(viewsets.ModelViewSet):
    queryset = Test.objects.all()
    serializer_class = TestSerializer

    # filterset_fields  = ['x']
    filter_backends = [DjangoFilterBackend]


class ArtistBadgeViewSet(viewsets.ModelViewSet):
    queryset = ArtistBadge.objects.all()
    serializer_class = ArtistBadgeSerializer


class FanBadgeViewSet(viewsets.ModelViewSet):
    queryset = FanBadge.objects.all()
    serializer_class = FanBadgeSerializer



class AdministratorViewSet(viewsets.ModelViewSet):
    queryset = Administrator.objects.all()
    serializer_class = AdministratorSerializer

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

#>> TODO : voir si BecomeMember sera afficher ou pas à la fin
class BecomeMemberViewSet(viewsets.ModelViewSet):
    queryset = BecomeMember.objects.all()
    serializer_class = BecomeMemberSerializer

    # permissions
    permission_classes = (IsAuthenticated,)


#>> TODO : voir si Content sera afficher ou pas à la fin
class ContentViewSet(viewsets.ModelViewSet):
    queryset = Content.objects.all()
    serializer_class = ContentSerializer

    # permissions
    permission_classes = (IsAuthenticated,)


#>> TODO : voir si ArtistType sera afficher ou pas à la fin
class ArtistTypeViewSet(viewsets.ModelViewSet):
    queryset = ArtistType.objects.all()
    serializer_class = ArtistTypeSerializer

    # permissions
    permission_classes = (IsAuthenticated,)

class EmailValidationViewSet(viewsets.ModelViewSet):
    queryset = EmailValidation.objects.all()
    serializer_class = EmailValidationSerializer

    # permissions
    # permission_classes = (IsAuthenticated,)
    # filterset_fields  = ['email']
    # filter_backends = [DjangoFilterBackend]


class UserAuthentificationView(views.APIView):

    def get(self, request):
        return Response({})
        
    def post(self, request):
        username = UserAuthentification(request.POST.get('username'))
        password = UserAuthentification(request.POST.get('password'))
        user = UserAuthentification(username, password)
        res = UserAuthentificationSerializer(user, password)
        return Response(res)
            

class RegisterView(views.APIView):
    
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
        except Exception:
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
            ("name", "name"), 
            ("firstName", "firstName"), 
            ("sex", "sex"),
            ("address","address"),
            ("tel","téléphone"),
            ("dateOfBirth","date de naissance"),
            ("placeOfBirth", "lieu de naissance"),
            ("password", "mot de passe"),
            ("passwordConfirm", "confirmation mot de passe")
        ]
    
    def create_fan(self, aaUser):
        fan = Fan()
        fan.aaUser = aaUser
        fan.save()

    def create_artist(self, aaUser):
        artist = Artist()
        artist.aaUser = aaUser
        artist.save()

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

        # create user (api table : AAUser)
        aaUser = AAUser()
        aaUser.user = newUser
        aaUser.name = self.user.get("name")
        aaUser.firstName = self.user.get("firstName")
        aaUser.sex = self.user.get("sex")
        aaUser.email = self.user.get("email")
        aaUser.tel = self.user.get("tel")
        aaUser.address = self.user.get("address")
        aaUser.dateOfBirth = self.user.get("dateOfBirth")
        aaUser.placeOfBirth = self.user.get("placeOfBirth")
        aaUser.save()

        #create specific account for the user
        if self.user.get("accountType") == "fan":
            self.create_fan(aaUser)
        if self.user.get("accountType") == "artist":
            self.create_artist(aaUser)

        return aaUser


    def active_utilisateur(self, aaUser):
        aaUser.user.is_active = True
        aaUser.user.save()

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
            message = "ce name d'aaUser est déjà prise"
            return self.not_valid_field("username", message)
        
        # email adress control
        if self.user_exists_by_email():
            message = "un compte est déjà associé à cet email"
            return self.not_valid_field("email", message)
        
        # password confirmation control
        if self.user.get("password") != self.user.get("passwordConfirm"):
            return self.not_valid_field("password", "les mots de passe ne correspondent pas")

        # create user
        aaUser = self.create_user()

        validation = EmailValidation()
        validation.set_utilisateur(aaUser)
        validation.save()
        validation.send_validation_code()

        # activate user account : temporarily
        # in future it will be activated after email validation
        self.active_utilisateur(aaUser)

        print(' after activation : ', aaUser.user.is_active)



        return Response({
            "success": True
        }) 


# get user by token
class AAUserByTokenView(views.APIView):
    utilisateurUrl = '/aauser/?user__username='
    def utilisateur_url(self, username):
        return self.utilisateurUrl+username

    def post(self, request):
        try:
            token = request.data.get("token")
            print(">>>>> token:", token)
            user = Token.objects.get(key=token).user
            return response.HttpResponseRedirect(redirect_to= self.utilisateur_url(user.username))
        except Exception:
            return Response([])


class CoverPictureUploadView(views.APIView):

    def get_cover_upload_filename(self,  userId):
        filename, ext = os.path.splitext(str(self.coverPictureFile))    
        filename = "user_{0}-cover{1}".format(userId, ext)
        return filename

    def post(self, request):
        try:
            self.coverPictureFile = request.FILES["coverPicture"]
            userId = request.data.get("userId")
            filename = self.get_cover_upload_filename(userId)

            aaUser = AAUser.objects.get(id=userId)
            aaUser.coverPicture.save(
                os.path.basename(filename),
                File(self.coverPictureFile)
            )
            aaUser.save()
            
            imageUrl = request.build_absolute_uri(aaUser.coverPicture.url)
            return Response({"filename": imageUrl})

        except Exception as error:
            print("/!\ /!\ upload error ==>", error)
            return Response({"message": "upload failed"})


class ProfilePictureUploadView(views.APIView):

    def get_profile_upload_filename(self,  userId):
        filename, ext = os.path.splitext(str(self.profilePictureFile))    
        filename = "user_{0}-profile{1}".format(userId, ext)
        return filename

    def post(self, request):
        try:
            self.profilePictureFile = request.FILES["profilePicture"]
            userId = request.data.get("userId")
            filename = self.get_profile_upload_filename(userId)

            aaUser = AAUser.objects.get(id=userId)
            aaUser.profilePicture.save(
                os.path.basename(filename),
                File(self.profilePictureFile)
            )
            aaUser.save()
            imageUrl = request.build_absolute_uri(aaUser.profilePicture.url)
            return Response({"filename": imageUrl})

        except Exception as error:
            print("/!\ /!\ upload error ==>", error)
            return Response({"message": "upload failed"})


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


