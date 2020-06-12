from django.shortcuts import render
from django.urls import reverse
from django.http import HttpResponseRedirect
from django.views import generic
from django.contrib import messages
from .forms import RegisterUserForm

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
			messages.success(request,f'Your account has been registered. You can now sign in.')
			return HttpResponseRedirect(reverse('user:signin'))
		return render(request,self.template_name,context)
