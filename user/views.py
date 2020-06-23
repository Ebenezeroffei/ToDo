from django.shortcuts import render
from django.urls import reverse
from django.http import HttpResponseRedirect
from django.views import generic
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.contrib import messages
from app.models import Task
from .forms import RegisterUserForm,EditUserProfileForm
from .models import UserAvatar

# Create your views here.
class RegisterUserView(generic.View):
	""" This class registers a new user """
	form_class = RegisterUserForm
	template_name = 'user/signup.html'
	
	def get(self,request,*args,**kwargs):
		form = self.form_class()
		context = {
			'form': form
		}
		
		return render(request,self.template_name,context)
	
	def post(self,request,*args,**kwargs):
		form = self.form_class(request.POST)
		context = {
			'form': form
		}
		if form.is_valid():
			form.save()
			# Save the users profile pic
			user_id = form.id
			avatar = UserAvatar(user = user_id)
			avatar.save()
			messages.success(request,f'Your account has been registered. You can now sign in.')
			return HttpResponseRedirect(reverse('user:signin'))
		return render(request,self.template_name,context)

	
class UserProfileView(generic.View):
	""" This class shows the profile of the user """
	@method_decorator(login_required)
	def dispatch(self,request,*args,**kwargs):
		tasks = Task.objects.filter(user = request.user)
		context = {
			'tasks_in_progress': len([task for task in tasks if not task.task_completed and not task.is_uncompleted ]),
			'completed_tasks': len([task for task in tasks if task.task_completed and task.completed_by ]),
			'uncompleted_tasks': len([task for task in tasks if not task.task_completed and task.is_uncompleted ])
		}
		return render(request,'user/profile.html',context)
	
class EditUserProfileView(generic.View):
	""" This class edits the profile of a user """
	form_class = EditUserProfileForm
	template_name = 'user/edit_profile.html'
	
	@method_decorator(login_required)
	def get(self,request,*args,**kwargs):
		form = self.form_class(instance = request.user)
		return render(request,self.template_name,{'form':form})
	
	@method_decorator(login_required)
	def post(self,request,*args,**kwargs):
		form = self.form_class(request.POST,instance = request.user)
		if form.is_valid(): # Valid form
			form.save() # Save it into the database
			return HttpResponseRedirect(reverse('user:profile'));
	
		return render(request,self.template_name,{'form':form})