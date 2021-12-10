from django.db.models import fields
from api.models import Administrator, Artist, ArtistBadge, FanBadge, Content, BecomeMember, FanClub, Page, Publication, Test, ArtistType, AAUser, EmailValidation
from rest_framework import serializers

from django.contrib.auth import get_user_model

class ArtistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Artist
        fields = '__all__'

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

    class Meta:
        model = AAUser
        # exclude = ['dateOfBirth']
        fields = '__all__'


class AdministratorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Administrator
        fields = '__all__'


class PublicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Publication
        fields = '__all__'


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
    class Meta:
        model = Content
        fields = '__all__'

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
