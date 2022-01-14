from django.db.models import fields
from api.models import Administrator, Artist, ArtistBadge, Comment, Fan, FanBadge, Content, BecomeMember, FanClub, Like, Page, Publication, Subscribe, Test, ArtistType, AAUser, EmailValidation
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
    username = serializers.CharField(source="user.username", read_only=True)    
    # fullname = serializers.JSONField(source="get_fullname")
    subscribers = serializers.JSONField(source="get_subscriberIds", read_only=True)

    class Meta:
        model = AAUser
        # exclude = ['profilePicture', 'coverPicture'] 
        exclude = ['user', ]       
        depth = 1 
        # fields = '__all__'
"""
depth = 0
"""
class AAUserSerializer2(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)    
    # fullname = serializers.JSONField(source="get_fullname")
    subscribers = serializers.JSONField(source="get_subscriberIds", read_only=True)
    # subscribers = serializers.SerializerMethodField()
    class Meta:
        model = AAUser    
        exclude = ['user', 'active', 'dateOfBirth', 'placeOfBirth', 'pseudo']  
        depth = 0

class AdministratorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Administrator
        fields = '__all__'
    

class LikeSerializer(serializers.ModelSerializer):
    user = AAUserSerializer2(source="aaUser")
    class Meta:
        model = Like
        # fields = '__all__'
        exclude = ['aaUser',]
        depth = 1

class CommentSerializer(serializers.ModelSerializer):
    author = AAUserSerializer2(source="aaUser")
    publishTime = serializers.JSONField(source="get_publishTime") 
    class Meta:
        model = Comment
        # fields = '__all__'
        exclude = ['aaUser',]
        depth = 0

class SubscribeSerializer(serializers.ModelSerializer):
    # subscribed = AAUserSerializer2(source="aaUser")
    # subscriber = AAUserSerializer2(source="subscriber")
    class Meta:
        model = Subscribe
        fields = '__all__'
        # exclude = ['aaUser',]

class PublicationSerializer(serializers.ModelSerializer):
    comments = serializers.JSONField(source="get_comments")   
    likes = serializers.SerializerMethodField()
    comments = serializers.SerializerMethodField()
    publisher = AAUserSerializer(source="userPublisher")
    class Meta:
        model = Publication
        # fields = '__all__'
        exclude=['userPublisher']
        depth = 1
    
    def get_likes(self, publication):        
        return LikeSerializer(publication.get_likes(), many=True, context=self.context ).data
    
    def get_comments(self, publication):        
        return CommentSerializer(publication.get_comments(), many=True, context=self.context ).data

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
