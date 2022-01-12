# from api.models import *

def get_a_valid_django_user(id=1):
    return {
        "username":"user{0}".format(id),
        "email": "user{0}@mail.com".format(id),
        "password": "toor",
    }

def get_a_not_valid_django_user():
    return {
        "username": "",
        "email": "",
        "password": ""
}


def get_a_valid_aaUser(id=1):
    return {
        "name": "user{0}-nom".format(id),
        "sex": "HOMME",
        "firstName": "user{0}-prenom".format(id),
        "email": "user{0}@mail.com".format(id),
        "biography": "--biography",
        "tel": "099886567",
        "address": "Marseille",
        "dateOfBirth": "1999-01-01",
        "placeOfBirth": "Marseille",
        "profilePicture": None,
        "coverPicture": None,        
    }

def get_a_not_valid_aaUser():
    return {
        "name": "",
        "sex": "",
        "firstName": "",
        "biography": "",
        "tel": "",
        "address": "",
        "dateOfBirth": None,
        "placeOfBirth": None,
        "profilePicture": None,
        "coverPicture": None,        
    }



userTest1 = get_a_valid_django_user()
notValidUser = get_a_not_valid_django_user()

aaUserTest1 = get_a_valid_aaUser()
notValidAaUserTest1 = get_a_not_valid_aaUser()