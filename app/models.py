from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User
from datetime import datetime

# Create your models here.

class Task(models.Model):
	user = models.ForeignKey(User,on_delete = models.CASCADE)
	action = models.CharField(max_length = 200)
	completed_by = models.DateTimeField()
	completed_on = models.DateTimeField(null = True,default = None)
	task_completed = models.BooleanField(default = False)
	
	def __str__(self):
		return f'{self.user.username} - {self.action}'
	
	def is_uncompleted(self):
		""" This checks if a task is in progress or in uncomplete """
		return self.completed_by > timezone.now() and not self.task_completed