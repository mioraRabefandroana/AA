from logging import error
from django.test import TestCase
from api.models import AAUser, Artist, Comment, Fan, Like, Publication, Subscribe
from django.contrib.auth import get_user_model
from django.contrib.auth.models import User
from django.db import transaction
from api.data_for_test import *

class TestCases(TestCase):
    def setUp(self):
        # AAUser.objects.create(name="lion", sound="roar")
        # Animal.objects.create(name="cat", sound="meow")
        pass

    def create_django_user(self, user):
        try:
            # print(user)
            with transaction.atomic():
                return User.objects.create_user(
                    user.get("username"), 
                    user.get("email"), 
                    user.get("password")
                )
        except Exception as error:
            print("/!\ error :", error)
            return None

    def create_not_valid_django_user(self):
        return self.create_django_user( notValidUser )

    def get_aaUser_mandatory_fields(self):
        return [
            "email",
            "name",
            "firstName",
            "sex",
            "address",
            "tel",
            "dateOfBirth",
            "placeOfBirth",
        ]

    def create_aaUser(self, data):
        try:
            # print(data)
            with transaction.atomic():
                aaUser = AAUser()
                aaUser.user = data.get("user")
                aaUser.name = data.get("name")
                aaUser.firstName = data.get("firstName")
                aaUser.sex = data.get("sex")
                aaUser.email = data.get("email")
                aaUser.tel = data.get("tel")
                aaUser.address = data.get("address")
                aaUser.dateOfBirth = data.get("dateOfBirth")
                aaUser.placeOfBirth = data.get("placeOfBirth")
                # aaUser.profilePicture = None
                # aaUser.coverPicture = None
                aaUser.save()
            # self.fail('Duplicate question allowed.')
            return aaUser
        except Exception as error:
            print("/!\ error :", error)
            return None

    """
    USER
    """
    def test_aaUser(self):
        # 1 - tester la création d'un utilisateur django SANS Spécifier le nom d'utilisateur
        # => ceci devrait être interdit 
        self.assertTrue( self.create_not_valid_django_user() is None)

        # 2 - tester la création d'un utilisateur django AVEC de bonne valeurs
        # => L'utilisateur devrait se créer sans soucis   
        newUser = self.create_django_user( userTest1 )
        # print(newUser)
        self.assertTrue(newUser is not None)
        # 2.1 - Test d'Integrité : si l'on essaye de créer un ulisateur avec le même username, ça devrait être refusé
        self.assertTrue(self.create_django_user( userTest1 ) is None)


        # 3 - test de création d'un utilisateur de l'application : AAUser
        # => si l'un d'un champ obligatoire n'est pas spécifié, l'ajout doit être refusé
        mandatories = self.get_aaUser_mandatory_fields()
        # Tester la création d'un utilisateur en enlevant un à un les champs obligatoire
        for fieldName in mandatories:  
            print("- utilisateur sans : ", fieldName)          
            validAaUserTest = get_a_valid_aaUser()
            validAaUserTest['user'] = newUser
            # supprimer la valeur du champ obligatoire
            validAaUserTest[fieldName] = None
            newAaUser = self.create_aaUser(validAaUserTest)
            self.assertTrue( newAaUser is None)
        
        # 4 - test de création d'un utilisateur de l'application avec des bonnes valeur
        validAaUserTest = get_a_valid_aaUser()
        validAaUserTest['user'] = newUser
        newAaUser = self.create_aaUser(validAaUserTest)
        self.assertTrue( newAaUser is not None)
        self.newAaUser = newAaUser
    
        print("AAUser -> OK")


    def create_a_complete_aaUser(self, id=1):
        with transaction.atomic():
            userInfo = get_a_valid_django_user(id)
            user = self.create_django_user(userInfo)

            aaUserInfo = get_a_valid_aaUser(id)
            aaUserInfo["user"] = user
            newAaUser = self.create_aaUser(aaUserInfo)
            return newAaUser

    # a fan without user
    def create_fan(self, aaUser):
        try:            
            with transaction.atomic():
                fan = Fan()
                fan.aaUser = aaUser
                fan.save()
                return fan
        except Exception as error:
            print("/!\ error :", error)
            return None

    # an artist without user
    def create_artist(self, aaUser):
        try:            
            with transaction.atomic():
                artist = Artist()
                artist.aaUser = aaUser
                artist.save()
                return artist
        except Exception as error:
            print("/!\ error :", error)
            return None

    """
    FAN
    """
    def test_fan(self):
        # un fan doit toujour avoir un user
        aaUser = None
        newFan = self.create_fan(aaUser)
        self.assertTrue( newFan is None )

        # 
        aaUser = self.create_a_complete_aaUser()
        newFan = self.create_fan(aaUser)
        self.assertTrue( newFan is not None )
        
        print("FAN -> OK")

    """
    ARTIST
    """
    def test_artist(self):
        # un artiste doit toujour avoir un user
        aaUser = None
        newArtist = self.create_artist(aaUser)
        self.assertTrue( newArtist is None )

        # 
        aaUser = self.create_a_complete_aaUser()
        newArtist = self.create_artist(aaUser)
        self.assertTrue( newArtist is not None )
        
        print("ARTIST -> OK")


    def create_publication(self, text, aaUser=None):
        try:       
            with transaction.atomic():
                p = Publication()
                p.userPublisher = (aaUser, self.create_a_complete_aaUser())[aaUser is None]
                p.text = text
                p.save()
                return p
        except Exception as error:
            print("/!\ error :", error)
            return None

    """
    PUBLICATION
    """
    def test_publication(self):
        # une publication doit avoir au moins un texte
        text = None
        p = self.create_publication(text)
        self.assertTrue(p is None)

        text = "lorem"
        p = self.create_publication(text)
        # la publication a été crée avec le text envoyé
        self.assertTrue(p is not None)
        self.assertEqual(p.text, text)

        print("PUBLICATION -> OK")

    def like_a_publication(self, publication, aaUserFan):
        try:       
            with transaction.atomic():                
                like = Like()
                like.publication = publication
                like.aaUser = aaUserFan
                like.save()
                return like
        except Exception as error:
            print("/!\ error :", error)
            return None

    """
    LIKE/UNLIKE
    """
    def test_like(self):
        aaUserFan = self.create_a_complete_aaUser(1)
        fan = self.create_fan( aaUserFan )
        aaUserArtist = self.create_a_complete_aaUser(2)
        artist = self.create_artist( aaUserArtist )
        publication = self.create_publication("test", aaUserArtist)
        
        # pas de like
        self.assertEqual( len(publication.get_likes()), 0 )

        like = self.like_a_publication(publication, aaUserFan)
        self.assertTrue( like is not None )

        # 1 like
        self.assertEqual( len(publication.get_likes()), 1 )

        # suppression du like
        like.delete()

        # 0 like de nouveau
        self.assertEqual( len(publication.get_likes()), 0 )

        print("LIKE -> OK")


    def comment_a_publication(self, publication, aaUserFan, text):
        try:       
            with transaction.atomic():                
                comment = Comment()
                comment.publication = publication
                comment.aaUser = aaUserFan
                comment.text = text
                comment.save()
                return comment
        except Exception as error:
            print("/!\ error :", error)
            return None
    """
    COMMENT
    """
    def test_comment(self):
        aaUserFan = self.create_a_complete_aaUser(1)
        fan = self.create_fan( aaUserFan )
        aaUserArtist = self.create_a_complete_aaUser(2)
        artist = self.create_artist( aaUserArtist )
        publication = self.create_publication("test", aaUserArtist)
        
        # pas de comment
        self.assertEqual( len(publication.get_comments()), 0 )

        comment = self.comment_a_publication(publication, aaUserFan, "test-comment")
        self.assertTrue( comment is not None )

        # 1 comment
        self.assertEqual( len(publication.get_comments()), 1 )
        self.assertTrue( comment in publication.get_comments() )


        # suppression du comment
        comment.delete()

        # 0 comment 
        self.assertEqual( len(publication.get_likes()), 0 )

        print("COMMENT -> OK")

    
    def subscribe(self, subscriber, subscribed):
        try:       
            with transaction.atomic():                
                s = Subscribe()
                s.subscriber = subscriber
                s.subscribed = subscribed
                s.save()
                return s
        except Exception as error:
            print("/!\ error subscribe :", error)
            return None

    """
    SUBSCRIBE/UNSUBSCRIBE
    """
    def test_subscribe(self):
        aaUserFan = self.create_a_complete_aaUser(1)
        fan = self.create_fan( aaUserFan )
        aaUserArtist = self.create_a_complete_aaUser(2)
        artist = self.create_artist( aaUserArtist )

        # 0 abonné
        self.assertEqual( len(aaUserArtist.get_subscriberIds()), 0 )

        # abonnement
        subscribe = self.subscribe(aaUserFan, aaUserArtist)

        self.assertTrue( subscribe is not None)
        
        # 1 abonné
        self.assertEqual( len(aaUserArtist.get_subscriberIds()), 1 )
        
        # désabonnement
        subscribe.delete()

        # 0 abonné 
        self.assertEqual( len(aaUserArtist.get_subscriberIds()), 0 )

        print("SUBSCRIBE -> OK")








