from django.urls import path
from django.contrib.auth.views import LoginView,LogoutView
from . import views as user_views

app_name = 'user'
urlpatterns = [
	path('',LoginView.as_view(template_name = 'user/signin.html'),name = 'signin'),
	path('logout/',LogoutView.as_view(),name = 'logout'),
	path('register/',user_views.RegisterUserView.as_view(),name = 'signup'),
	path('user/profile/',user_views.UserProfileView.as_view(),name = 'profile'),
	path('user/profile/edit/',user_views.EditUserProfileView.as_view(),name = 'edit_profile')
]