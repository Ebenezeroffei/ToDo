from django.urls import path
from . import views as app_views

app_name = 'app'
urlpatterns = [
	path('home/',app_views.HomePageView.as_view(),name = 'home'),
	path('task/add/',app_views.AddTaskView.as_view(),name = 'add_task'),
	path('task/completed/',app_views.CompletedTaskView.as_view(),name = 'completed_task'),
	path('task/delete/',app_views.DeleteTaskView.as_view(),name = 'delete_task'),
	path('task/deadlines/',app_views.GetTaskDeadlinesView.as_view(),name = 'deadlines'),
	path('task/uncompleted/',app_views.UncompletedTaskDetailsView.as_view(),name = 'uncompleted_task')
]