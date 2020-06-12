from django.shortcuts import render
from django.views import generic
from django.http import HttpResponse,JsonResponse
from django.contrib.auth.mixins import LoginRequiredMixin
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
		
		data = {}
		
		return JsonResponse
