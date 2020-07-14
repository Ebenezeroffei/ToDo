from django.db import models
from django.contrib.auth.models import User
from PIL import Image


# Create your models here.
class UserAvatar(models.Model):
	""" This class stores the profile pic of the user """
	
	user = models.OneToOneField(User,on_delete = models.CASCADE)
	image = models.ImageField(default = 'defaultAvatar.png',upload_to = 'profile_pics')
	
#    def __str__(self):
#        return f"{self.user.username}'s avatar"
    
	def save(self):
		super().save()
		
		img = Image.open(self.image.path)
		if img.width > 400 or img.height > 400:
			img.thumbnail((400,400))
			img.save(self.image.path)
    