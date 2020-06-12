from django.db import models
from django.contrib.auth.models import User
from datetime import datetime

# Create your models here.

class Task(models.Model):
	user = models.ForeignKey(User,on_delete = models.CASCADE)
	task = models.CharField(max_length = 200)
	completed_by = models.DateTimeField()
	completes_on = models.DateTimeField(null = True)
	task_completed = models.BooleanField(default = False)
	
	def __str__(self):
		return f'{self.user.username} - {self.task}'
	
	def is_uncompleted(self):
		""" This checks if a task is in progress or in uncomplete """
		return datetime.now() > completed_by