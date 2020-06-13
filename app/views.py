from django.shortcuts import render,get_object_or_404
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
	context_object_name = 'tasks_in_progress'
	template_name = 'app/index.html'
	
	def get_queryset(self,*args,**kwargs):
		return [task for task in Task.objects.filter(user = self.request.user) if not task.task_completed]
	
	def get_context_data(self,*args,**kwargs):
		context = super().get_context_data(*args,**kwargs)
		context['tasks_in_progress_total'] = len(context['tasks_in_progress'])
		context['completed_tasks'] = [task for task in Task.objects.filter(user = self.request.user) if task.task_completed]
		context['completed_tasks_total'] = len(context['completed_tasks'])
		return context
	
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
			action = task,
			completed_by = date_time
		)
		new_task.save()
		
		data = {
			'task_id': new_task.id
		}
		
		return JsonResponse(data)

	
class CompletedTaskView(LoginRequiredMixin,generic.View):
	""" This class changes a task status from task in pprogress too complete """
	
	def get(self,request,*args,**kwargs):
		task_id = request.GET.get('taskId')
		task = get_object_or_404(Task,id = task_id) # Get the task
		task.task_completed = True # Change it's status
		task.completed_on = tz.now()
		task.save() # Save it into the dataase
		
		data = {
			'action': task.action,
			'completed_on': task.completed_on,
			'task_id': task.id
		}
		
		return JsonResponse(data)
		