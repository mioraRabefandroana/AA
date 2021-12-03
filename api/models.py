from django.db import models
from django.contrib.auth.models import User
from random import random
# from multiselectfield import MultiSelectField

class Utilisateur(models.Model):
    id = models.BigAutoField(primary_key=True)

    user = models.OneToOneField(User, on_delete=models.CASCADE)

    SEXE = (
        ('HOMME', 'homme'),
        ('FEMME', 'femme')
    )

    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100)
    pseudo = models.CharField(max_length=100, blank=True, null=True)
    sexe = models.CharField(choices=SEXE, max_length=20, default='FEMME')
    
    email = models.CharField(max_length=200)
    tel = models.CharField(max_length=100)
    adresse = models.CharField(max_length=500)
    date_de_naissance = models.DateField()
    lieu_de_naissance = models.CharField(max_length=100)
    # mot_de_passe = models.CharField(max_length=1000)
    photo_profil  = models.CharField(max_length=1000, blank=True, null=True)
    photo_couverture = models.CharField(max_length=1000, blank=True, null=True)

    # TODO : vérifier si auto_now correspond bien à CURRENT_TIMESTAMP (sur le net)
    date_de_creation = models.DateTimeField(auto_now=True)

    active = models.BooleanField(default=False)

    def __str__(self):
        return self.nom_complet()
    
    
    def nom_complet(self):
        return self.prenom +' '+ self.nom

class TypeArtiste(models.Model):
    id = models.BigAutoField(primary_key=True)
    nom = models.CharField(max_length=100)
    description = models.TextField()
    icon = models.CharField(max_length=1000, null=True, blank=True)

    def __str__(self):
        return self.nom
    
class BadgeArtiste(models.Model):
    id = models.BigAutoField(primary_key=True)  
    nom = models.CharField(max_length=100) 
    description = models.TextField()
    icon = models.CharField(max_length=1000)

    def __str__(self):
        return self.nom
    
class BadgeFan(models.Model):
    id = models.BigAutoField(primary_key=True)  
    nom = models.CharField(max_length=100) 
    description = models.TextField()
    icon = models.CharField(max_length=1000)

    def __str__(self):
        return self.nom

class TypeOuvrage(models.Model):
    id = models.BigAutoField(primary_key=True)  
    nom = models.CharField(max_length=100) 
    description = models.TextField(null=True, blank=True)
    icon = models.CharField(max_length=1000, null=True, blank=True)


class Artiste(models.Model):
    id = models.BigAutoField(primary_key=True)

    type_artiste = models.ManyToManyField(TypeArtiste, blank=True, null=True)
    nom_d_artiste = models.CharField(max_length=100, blank=True, null=True)
    biographie = models.TextField(blank=True, null=True)
    # badge_artiste = models.CharField(choices=BADGE_ARTISTE, max_length=100)
    badges = models.ManyToManyField(BadgeArtiste, blank=True, null=True)

    utilisateur = models.ForeignKey(Utilisateur, on_delete=models.CASCADE)

    def __str__(self):
        return self.nom_d_artiste

class Fan(models.Model):    
    id = models.BigAutoField(primary_key=True)

    # badges = models.CharField(choices=BADGE_FAN, max_length=100)
    badges = models.ManyToManyField(BadgeFan, blank=True, null=True)
    biographie = models.TextField(blank=True, null=True)    
    utilisateur = models.ForeignKey(Utilisateur, on_delete=models.CASCADE)

    def __str__(self):
        return self.utilisateur


class Test(models.Model):
    x = models.CharField(max_length=100)
    y = models.CharField(max_length=100)
    
    def __str__(self):
        return self.x+' '+self.y


class Ouvrage(models.Model):
    id = models.BigAutoField(primary_key=True)  
    type = models.ForeignKey(TypeOuvrage, on_delete=models.CASCADE)
    nom = models.CharField(max_length=100) 
    description = models.TextField()
    image = models.CharField(max_length=1000, null=True, blank=True)
    url = models.CharField(max_length=1000, null=True, blank=True)

    date_de_creation = models.DateTimeField(auto_now=True)
    createurs = models.ManyToManyField(Artiste)

    def __str__(self):
        return self.nom

class Administrateur(models.Model):
    id = models.BigAutoField(primary_key=True)

    description = models.TextField()

    # TODO : vérifier si auto_now correspond bien à CURRENT_TIMESTAMP (sur le net)
    date_de_creation = models.DateTimeField(auto_now=True)


class Publication(models.Model):
    id = models.BigAutoField(primary_key=True)

    text = models.TextField()

    # TODO : foreign key many to one
    # contenus = 

    # TODO : vérifier si auto_now correspond bien à CURRENT_TIMESTAMP (sur le net)
    date_de_publication = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.text


class Page(models.Model):
    id = models.BigAutoField(primary_key=True)

    nom = models.CharField(max_length=100)
    description = models.TextField()

    # TODO : vérifier si auto_now correspond bien à CURRENT_TIMESTAMP (sur le net)
    date_de_creation = models.DateTimeField(auto_now=True)
    
    proprietaire = models.ForeignKey(Artiste, on_delete=models.CASCADE)

    publications = models.ManyToManyField(Publication)

    def __str__(self):
        return self.nom


class FanClub(models.Model):
    id = models.BigAutoField(primary_key=True)

    nom = models.CharField(max_length=100)
    description = models.TextField()

    # TODO : vérifier si auto_now correspond bien à CURRENT_TIMESTAMP (sur le net)
    date_de_creation = models.DateTimeField(auto_now=True)

    membres = models.ManyToManyField(Fan, through='DevenirMembre')

    proprietaire = models.ForeignKey(Artiste, on_delete=models.CASCADE)

    publications = models.ManyToManyField(Publication)

    def __str__(self):
        return self.nom

class DevenirMembre(models.Model):
    id = models.BigAutoField(primary_key=True)

    fan = models.ForeignKey(Fan, on_delete=models.CASCADE)
    fanClub = models.ForeignKey(FanClub, on_delete=models.CASCADE)

    # TODO : vérifier si auto_now correspond bien à CURRENT_TIMESTAMP (sur le net)
    date_d_inscription = models.DateTimeField(auto_now=True)

    remarque = models.TextField()

class Contenu(models.Model):
    id = models.BigAutoField(primary_key=True)

    TYPE_CONTENU = (
        ('IMAGE', 'image'),
        ('VIDEO', 'video'),
        ('audio', 'audio'),        
    )

    type = models.CharField(choices=TYPE_CONTENU, max_length=100)
    description = models.TextField()
    source = models.CharField(max_length=500)

    # TODO : vérifier si auto_now correspond bien à CURRENT_TIMESTAMP (sur le net)
    date_de_creation = models.DateTimeField(auto_now=True)

    publication = models.ForeignKey(Publication, on_delete=models.CASCADE)


class Action(models.Model):
    id = models.BigAutoField(primary_key=True)

    TYPE_ACTION = (
        ('LIKE', 'like'),
        ('COMMENTAIRE', 'commentaire'),
        ('PARTAGE', 'partage'),        
    )

    type = models.CharField(choices=TYPE_ACTION, max_length=100)
    description = models.TextField()

    # TODO : vérifier si auto_now correspond bien à CURRENT_TIMESTAMP (sur le net)
    date_de_creation = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.type


class ValidationEmail(models.Model):
    id = models.BigAutoField(primary_key=True)
    code_de_validation = models.CharField(max_length=1000)

    utilisateur = models.ForeignKey(Utilisateur, on_delete=models.CASCADE)

    def set_validation_code(self):
        self.code_de_validation = int( random()*1000000 )
        print("validation code generated : ", self.code_de_validation)
    
    def get_validation_code(self):
        return self.code_de_validation
    
    def send_validation_code(self):
        # TODO: send validation code to user by email
        # pass
        print("code sent to ", self.utilisateur.email)

    def set_utilisateur(self, utilisateur):
        self.utilisateur = utilisateur
        self.set_validation_code()        

    def __str__(self):
        return self.code_de_validation




class UserAuthentification:
    def __init__(self, username, password):
        self.username = username
        self.password = password
