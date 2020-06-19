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
		return timezone.now() > self.completed_by
	
	def close_to_deadline(self):
		""" Returns an object which shows the number of seconds left for a task's deadline to reach """
		return self.completed_by - timezone.now()
