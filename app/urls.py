from django.urls import path
from . import views as app_views

app_name = 'app'
urlpatterns = [
	path('home/',app_views.HomePageView.as_view(),name = 'home'),
	path('task/add/',app_views.AddTaskView.as_view(),name = 'add_task'),
	path('task/completed/',app_views.CompletedTaskView.as_view(),name = 'completed_task')
]