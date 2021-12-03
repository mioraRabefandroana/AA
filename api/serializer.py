from django.db.models import fields
from api.models import Administrateur, Artiste, BadgeArtiste, BadgeFan, Contenu, DevenirMembre, FanClub, Page, Publication, Test, TypeArtiste, Utilisateur, ValidationEmail
from rest_framework import serializers

from django.contrib.auth import get_user_model

class ArtisteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Artiste
        fields = '__all__'

class BadgeArtisteSerializer(serializers.ModelSerializer):
    class Meta:
        model = BadgeArtiste
        fields = '__all__'

class BadgeFanSerializer(serializers.ModelSerializer):
    class Meta:
        model = BadgeFan
        fields = '__all__'

class TestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Test
        fields = '__all__'


class UtilisateurSerializer(serializers.ModelSerializer):

    # dateOfBirth = serializers.DateField(source='date_de_naissance')
    username = serializers.CharField(source="user.username")

    class Meta:
        model = Utilisateur
        # exclude = ['date_de_naissance']
        fields = '__all__'


class AdministrateurSerializer(serializers.ModelSerializer):
    class Meta:
        model = Administrateur
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

class DevenirMembreSerializer(serializers.ModelSerializer):
    class Meta:
        model = DevenirMembre
        fields = '__all__'

class ContenuSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contenu
        fields = '__all__'

class TypeArtisteSerializer(serializers.ModelSerializer):
    class Meta:
        model = TypeArtiste
        fields = '__all__'

class ValidationEmailSerializer(serializers.ModelSerializer):
    class Meta:
        model = ValidationEmail
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
