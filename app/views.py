from django.shortcuts import render
from django.views import generic
from django.utils import timezone as tz
from django.http import HttpResponse,JsonResponse
from django.contrib.auth.mixins import LoginRequiredMixin
from datetime import datetime
from .models import Task

# Create your views here.
class HomePageView(LoginRequiredMixin,generic.ListView):
	"""  This class dislays the homepage when a user logs in """
	model = Task
	context_object_name = 'tasks'
	template_name = 'app/index.html'
	
class AddTaskView(LoginRequiredMixin,generic.View):
	""" This class adds a new task to the users task """
	
	def get(self,request,*args,**kwargs):
		task = request.GET.get('task',None)
		date = request.GET.get('date',None)
		time = request.GET.get('time',None)
		date_list = list(map(lambda x : int(x),date.split('-')))
		time_list = list(map(lambda x : int(x),time.split(':')))
		date_time = datetime(date_list[0],date_list[1],date_list[2],time_list[0],time_list[1],tzinfo = tz.get_current_timezone())
		print(date_time)
		# Create and save task into the database
		new_task =  Task(
			user = request.user,
			task = task,
			completed_by = date_time
		)
#		new_task.save()
		
		data = {
#			task_id: new_task.id
		}
		
		return JsonResponse(data)
