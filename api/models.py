from django.db import models
from django.contrib.auth.models import User
from random import random

# from multiselectfield import MultiSelectField

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
    # mot_de_passe = models.CharField(max_length=1000)
    # profilePicture  = models.CharField(max_length=1000, blank=True, null=True)
    # coverPicture = models.CharField(max_length=1000, blank=True, null=True)
    profilePicture  = models.ImageField(upload_to="profilePicture/", blank=True, null=True)
    coverPicture  = models.ImageField(upload_to="coverPicture/".format(id), blank=True, null=True)

    # TODO : vérifier si auto_now correspond bien à CURRENT_TIMESTAMP (sur le net)
    creationDate = models.DateTimeField(auto_now=True)

    # 0 : waiting for email validation
    # 1 : active => user account is active and can be used :)
    active = models.BooleanField(default=False)

    def __str__(self):
        return self.fullname()
    
    
    def fullname(self):
        return self.firstName +' '+ self.name
    
    def get_artist(self):
        try:
            return Artist.objects.get(aaUser_id=self.id)
        except Exception:
            return None
    
    def get_fan(self):
        try:
            return Fan.objects.get(aaUser_id=self.id)
        except Exception:
            return None


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

    # TODO : vérifier si auto_now correspond bien à CURRENT_TIMESTAMP (sur le net)
    creationDate = models.DateTimeField(auto_now=True)


class Publication(models.Model):
    id = models.BigAutoField(primary_key=True)

    text = models.TextField()

    # TODO : foreign key many to one
    # contents = 

    # TODO : vérifier si auto_now correspond bien à CURRENT_TIMESTAMP (sur le net)
    publicationDate = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.text


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

    # TODO : vérifier si auto_now correspond bien à CURRENT_TIMESTAMP (sur le net)
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

    # TODO : vérifier si auto_now correspond bien à CURRENT_TIMESTAMP (sur le net)
    inscriptionDate = models.DateTimeField(auto_now=True)

    remark = models.TextField()

class Content(models.Model):
    id = models.BigAutoField(primary_key=True)

    CONTENT_TYPE = (
        ('IMAGE', 'image'),
        ('VIDEO', 'video'),
        ('audio', 'audio'),        
    )

    type = models.CharField(choices=CONTENT_TYPE, max_length=100)
    description = models.TextField()
    source = models.CharField(max_length=500)

    # TODO : vérifier si auto_now correspond bien à CURRENT_TIMESTAMP (sur le net)
    creationDate = models.DateTimeField(auto_now=True)

    publication = models.ForeignKey(Publication, on_delete=models.CASCADE)


class Action(models.Model):
    id = models.BigAutoField(primary_key=True)

    ACTION_TYPE = (
        ('LIKE', 'like'),
        ('COMMENTAIRE', 'commentaire'),
        ('PARTAGE', 'partage'),        
    )

    type = models.CharField(choices=ACTION_TYPE, max_length=100)
    description = models.TextField()

    # TODO : vérifier si auto_now correspond bien à CURRENT_TIMESTAMP (sur le net)
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
        # TODO: send validation code to user by email
        # pass
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
