from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

class RegisterUserForm(UserCreationForm):
	""" This class creates a form  """
	class Meta:
		model = User
		fields = ['username','email','password1']
		widgets = {
			'username': forms.TextInput(attrs = {
				'class': 'form-control form-control-sm',
			}),
			'email': forms.EmailInput(attrs = {
				'class': 'form-control form-control-sm',
			}),
			'password1': forms.PasswordInput(attrs = {
				'class': 'form-control form-control-sm',
			}),
		}
		
class EditUserProfileForm(forms.ModelForm):
	class Meta:
		model = User
		fields = ['first_name','last_name','username','email']
		widgets = {
			'first_name': forms.TextInput(attrs = {
				'class': 'form-control form-control-sm',
			}),
			'last_name': forms.TextInput(attrs = {
				'class': 'form-control form-control-sm',
			}),
			'username': forms.TextInput(attrs = {
				'class': 'form-control form-control-sm',
			}),
			'email': forms.EmailInput(attrs = {
				'class': 'form-control form-control-sm',
			})
		}