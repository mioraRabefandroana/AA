from datetime import datetime
from django.db import models
from django.contrib.auth.models import User
from random import random


class AAUser(models.Model):
    id = models.BigAutoField(primary_key=True)

    user = models.OneToOneField(User, on_delete=models.CASCADE)

    SEXE = (
        ('HOMME', 'homme'),
        ('FEMME', 'femme')
    )

    name = models.CharField(max_length=100)
    firstName = models.CharField(max_length=100)
    pseudo = models.CharField(max_length=100, blank=True, null=True)
    sex = models.CharField(choices=SEXE, max_length=20, default='FEMME')
    
    biography = models.TextField(blank=True, null=True)

    email = models.CharField(max_length=200)
    tel = models.CharField(max_length=100)
    address = models.CharField(max_length=500)
    dateOfBirth = models.DateField()
    placeOfBirth = models.CharField(max_length=100)
    
    profilePicture  = models.ImageField(upload_to="profilePicture/", blank=True, null=True)
    coverPicture  = models.ImageField(upload_to="coverPicture/", blank=True, null=True)

    creationDate = models.DateTimeField(auto_now=True)

    # 0 : waiting for email validation
    # 1 : active => user account is active and can be used :)
    active = models.BooleanField(default=False)

    def __str__(self):
        return self.get_fullname()
    
    def get_profilePicture_url(self):
        if self.profilePicture and hasattr(self.profilePicture, 'url'):
            return self.profilePicture.url
        return None

    def get_coverPicture_url(self):
        if self.coverPicture and hasattr(self.coverPicture, 'url'):
            return self.coverPicture.url
        return None
    
    def get_fullname(self):
        return self.firstName +' '+ self.name
    
    def get_artist(self):
        try:
            return Artist.objects.get(aaUser_id=self.id)
        except Exception:
            return None

    def get_username(self):
        return self.user.username

    def get_fan(self):
        try:
            from api.models import Fan
            return Fan.objects.get(aaUser_id=self.id)
        except Exception:
            return None
    
    def get_subscribers(self):
        try:
            from api.models import Subscribe
            return [ subscriber.subscriber.name for subscriber in Subscribe.objects.filter(subscribed_id=self.id) ] #.order_by("-id")
        except Exception as e:
            print(">>>>> get subscribers error", e)
            return []
    
    def get_subscriberIds(self):
        try:
            from api.models import Subscribe
            return [ subscriber.subscriber.id for subscriber in Subscribe.objects.filter(subscribed_id=self.id) ] #.order_by("-id")
        except Exception as error:
            print(">>>>> get subscribers error", error)
            return []
    
    """
    get all user artist that current use has been subscribed
    """
    def get_subsriptions(self):
        try:
            from api.models import Subscribe
            return [ subscribe.subscribed for subscribe in Subscribe.objects.filter(subscriber_id=self.id).order_by("-id") ]
        except Exception as error:
            print(">>>>> get_subsribedList", error)
            return []            

    """
    get user publications
    """
    def get_publications(self):
        try:
            from api.models import Publication
            return Publication.objects.filter(userPublisher_id=self.id).order_by("-id")
        except Exception as error:
            print("No publications yet for user ", self.id, error)
            return []

    """
    get publication related to the user : by subscribed first then the rest
    """
    def get_proposed_publications(self):  
        # HERE
        try:
            subscriptions = self.get_subsriptions()
            
            pubIds = []
            for s in subscriptions:
                ps = s.get_publications()
                for p in ps:
                    pubIds.append(p.id)

            pubIds.sort()
            publications = []
            for pubId in pubIds:
                try:
                    publications.append( Publication.objects.get(id=pubId) )
                except Exception:
                    pass
            
            morePublications = Publication.objects.all().order_by("-id")
            morePublications = [p  for p in morePublications if p.id not in pubIds ]

            return publications + morePublications

        except Exception as error:
            print(">>>>> get_proposed_publications", error)
            return []  


class ArtistType(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=100)
    description = models.TextField()
    icon = models.CharField(max_length=1000, null=True, blank=True)

    def __str__(self):
        return self.name
    
class ArtistBadge(models.Model):
    id = models.BigAutoField(primary_key=True)  
    name = models.CharField(max_length=100) 
    description = models.TextField()
    icon = models.CharField(max_length=1000)

    def __str__(self):
        return self.name
    
class FanBadge(models.Model):
    id = models.BigAutoField(primary_key=True)  
    name = models.CharField(max_length=100) 
    description = models.TextField()
    icon = models.CharField(max_length=1000)

    def __str__(self):
        return self.name

class WorkType(models.Model):
    id = models.BigAutoField(primary_key=True)  
    name = models.CharField(max_length=100) 
    description = models.TextField(null=True, blank=True)
    icon = models.CharField(max_length=1000, null=True, blank=True)


class Artist(models.Model):
    id = models.BigAutoField(primary_key=True)

    type = models.ManyToManyField(ArtistType, blank=True, null=True)
    stageName = models.CharField(max_length=100, blank=True, null=True)
    badges = models.ManyToManyField(ArtistBadge, blank=True, null=True)

    aaUser = models.ForeignKey(AAUser, on_delete=models.CASCADE)

    def __str__(self):
        return self.stageName

class Fan(models.Model):    
    id = models.BigAutoField(primary_key=True)

    # badges = models.CharField(choices=BADGE_FAN, max_length=100)
    badges = models.ManyToManyField(FanBadge, blank=True, null=True)  
    aaUser = models.ForeignKey(AAUser, on_delete=models.CASCADE)

    def __str__(self):
        return self.aaUser


class Test(models.Model):
    x = models.CharField(max_length=100)
    y = models.CharField(max_length=100)
    
    def __str__(self):
        return self.x+' '+self.y


class Work(models.Model):
    id = models.BigAutoField(primary_key=True)  
    type = models.ForeignKey(WorkType, on_delete=models.CASCADE)
    name = models.CharField(max_length=100) 
    description = models.TextField()
    image = models.CharField(max_length=1000, null=True, blank=True)
    url = models.CharField(max_length=1000, null=True, blank=True)

    creationDate = models.DateTimeField(auto_now=True)
    createurs = models.ManyToManyField(Artist)

    def __str__(self):
        return self.name

class Administrator(models.Model):
    id = models.BigAutoField(primary_key=True)

    description = models.TextField()

    creationDate = models.DateTimeField(auto_now=True)

class Content(models.Model):
    id = models.BigAutoField(primary_key=True)

    CONTENT_TYPE = (
        ('IMAGE', 'image'),
        ('VIDEO', 'video'),
        ('audio', 'audio'),        
    )

    type = models.CharField(choices=CONTENT_TYPE, max_length=100)
    description = models.TextField(blank=True, null=True)
    source = models.CharField(max_length=500, blank=True, null=True)

    image = models.ImageField(upload_to="publication/", blank=True, null=True)

    creationDate = models.DateTimeField(auto_now=True)


class Publication(models.Model):
    id = models.BigAutoField(primary_key=True)
    text = models.TextField()
    contents = models.ManyToManyField(Content, blank=True, null=True)

    publicationDate = models.DateTimeField(auto_now=True)
    userPublisher = models.ForeignKey(AAUser, on_delete=models.CASCADE)

    def __str__(self):
        return self.text

    def get_likes(self):
        try:
            from api.models import Like
            return Like.objects.filter(publication_id=self.id).order_by("-id")
        except Exception as e:
            print(">>>>> get likes error", e)
            return []
    
    def get_comments(self):
        try:
            from api.models import Comment
            return Comment.objects.filter(publication_id=self.id).order_by("-id")
        except Exception as e:
            print(">>>>> get comments error", e)
            return []


class Like(models.Model):
    id = models.BigAutoField(primary_key=True)
    aaUser = models.ForeignKey(AAUser, on_delete=models.CASCADE)
    publication = models.ForeignKey(Publication, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now=True)

class Comment(models.Model):
    id = models.BigAutoField(primary_key=True)
    text = models.TextField()
    aaUser = models.ForeignKey(AAUser, on_delete=models.CASCADE)
    publication = models.ForeignKey(Publication, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now=True)

    def get_publishTime(self):
        return self.date.strftime("%d/%m/%Y %H:%M")

class Subscribe(models.Model):
    id = models.BigAutoField(primary_key=True)
    # the subscriber : user that subscribe [fan]
    subscriber = models.ForeignKey(AAUser, on_delete=models.CASCADE, related_name='the_fan')

    # the user that has been subscribed [artist]
    subscribed = models.ForeignKey(AAUser, on_delete=models.CASCADE, related_name="the_artist")

    date = models.DateTimeField(auto_now=True)
    def __str__(self) -> str:
        return 

class Page(models.Model):
    id = models.BigAutoField(primary_key=True)

    name = models.CharField(max_length=100)
    description = models.TextField()

    # TODO : vérifier si auto_now correspond bien à CURRENT_TIMESTAMP (sur le net)
    creationDate = models.DateTimeField(auto_now=True)
    
    owner = models.ForeignKey(Artist, on_delete=models.CASCADE)

    publications = models.ManyToManyField(Publication)

    def __str__(self):
        return self.name


class FanClub(models.Model):
    id = models.BigAutoField(primary_key=True)

    name = models.CharField(max_length=100)
    description = models.TextField()

    creationDate = models.DateTimeField(auto_now=True)

    members = models.ManyToManyField(Fan, through='BecomeMember')

    owner = models.ForeignKey(Artist, on_delete=models.CASCADE)

    publications = models.ManyToManyField(Publication)

    def __str__(self):
        return self.name

class BecomeMember(models.Model):
    id = models.BigAutoField(primary_key=True)

    fan = models.ForeignKey(Fan, on_delete=models.CASCADE)
    fanClub = models.ForeignKey(FanClub, on_delete=models.CASCADE)

    inscriptionDate = models.DateTimeField(auto_now=True)

    remark = models.TextField()



class Action(models.Model):
    id = models.BigAutoField(primary_key=True)

    ACTION_TYPE = (
        ('LIKE', 'like'),
        ('COMMENTAIRE', 'commentaire'),
        ('PARTAGE', 'partage'),        
    )

    type = models.CharField(choices=ACTION_TYPE, max_length=100)
    description = models.TextField()

    creationDate = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.type


class EmailValidation(models.Model):
    id = models.BigAutoField(primary_key=True)
    validationCode = models.CharField(max_length=1000)

    aaUser = models.ForeignKey(AAUser, on_delete=models.CASCADE)

    def set_validation_code(self):
        self.validationCode = int( random()*1000000 )
        print("validation code generated : ", self.validationCode)
    
    def get_validation_code(self):
        return self.validationCode
    
    def send_validation_code(self):
        print("code sent to ", self.aaUser.email)

    def set_utilisateur(self, aaUser):
        self.aaUser = aaUser
        self.set_validation_code()        

    def __str__(self):
        return self.validationCode




class UserAuthentification:
    def __init__(self, username, password):
        self.username = username
        self.password = password