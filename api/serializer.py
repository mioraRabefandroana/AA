from django.db.models import fields
from api.models import Administrator, Artist, ArtistBadge, Fan, FanBadge, Content, BecomeMember, FanClub, Like, Page, Publication, Test, ArtistType, AAUser, EmailValidation
from rest_framework import serializers

from django.contrib.auth import get_user_model

class FanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fan
        exclude = ['aaUser']
        # fields = '__all__'

class ArtistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Artist
        exclude = ['aaUser']
        # fields = '__all__'

class ArtistBadgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArtistBadge
        fields = '__all__'

class FanBadgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = FanBadge
        fields = '__all__'

class TestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Test
        fields = '__all__'


class AAUserSerializer(serializers.ModelSerializer):

    # dateOfBirth = serializers.DateField(source='dateOfBirth')
    username = serializers.CharField(source="user.username")    
    fullname = serializers.CharField(source="get_fullname")
    # profilePictureUrl = serializers.CharField(source="get_profilePicture_url")
    # coverPictureUrl = serializers.CharField(source="get_coverPicture_url")

    # profilePictureUrl = serializers.SerializerMethodField()
    # coverPictureUrl = serializers.SerializerMethodField()
    class Meta:
        model = AAUser
        # exclude = ['profilePicture', 'coverPicture']        
        depth = 1 
        fields = '__all__'
    
    # def get_profilePictureUrl(self, aaUser):
    #     if(not aaUser.profilePicture):
    #         return None
    #     request = self.context.get('request')
    #     photo_url = aaUser.profilePicture.url

    #     if(photo_url):
    #         return request.build_absolute_uri(photo_url)
    #     return None
    
    # def get_coverPictureUrl(self, aaUser):
    #     if(not aaUser.coverPicture):
    #         return None

    #     request = self.context.get('request')
    #     photo_url = aaUser.coverPicture.url

    #     if(photo_url):
    #         return request.build_absolute_uri(photo_url)
    #     return None

    # def get_profilePicture_url(self, aaUser):
    #     request = self.context.get('request')
    #     # photo_url = aaUser.profilePicture.url
    #     return request.build_absolute_uri(aaUser.profilePicture.url)

class AdministratorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Administrator
        fields = '__all__'
    

class LikeSerializer(serializers.ModelSerializer):
    # user = serializers.SerializerMethodField() 
    user = AAUserSerializer(source="aaUser")
    class Meta:
        model = Like
        # fields = '__all__'
        exclude = ['aaUser',]
        depth = 1

    # def get_user(self, aaUser):
    #     return AAUserSerializer(aaUser, context=self.context ).data


class PublicationSerializer(serializers.ModelSerializer):
    # comments = serializers.CharField(source="get_comments")    
    # TODO : récupérer les vrais commentaires
    comments = serializers.JSONField(source="get_comments")   
    likes = serializers.SerializerMethodField()
    class Meta:
        model = Publication
        fields = '__all__'
        depth = 1
    
    def get_likes(self, publication):        
        return LikeSerializer(publication.get_likes(), many=True, context=self.context ).data

class PageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Page
        fields = '__all__'

class FanClubSerializer(serializers.ModelSerializer):
    class Meta:
        model = FanClub
        fields = '__all__'

class BecomeMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = BecomeMember
        fields = '__all__'

class ContentSerializer(serializers.ModelSerializer):
    imageUrl = serializers.SerializerMethodField()
    class Meta:
        model = Content
        # fields = '__all__'
        exclude = ['image']
    
    
    def get_imageUrl(self, content):
        if(not content.image):
            return None
        request = self.context.get('request')
        photo_url = content.image.url

        if(photo_url):
            return request.build_absolute_uri(photo_url)
        return None

class ArtistTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArtistType
        fields = '__all__'

class EmailValidationSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmailValidation
        fields = '__all__'

#########################################################################
class UserAuthentificationSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()




UserModel = get_user_model()
class UserSerializer(serializers.ModelSerializer):

    password = serializers.CharField(write_only=True)
    email = serializers.CharField(write_only=True)

    def create(self, validated_data):

        user = UserModel.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            email=validated_data['email'],
        )

        return user

    class Meta:
        model = UserModel
        fields = ( "id", "username", "password", 'email', )
