// Function that adds a task to the users To-Do list
let addTask = (url) => {
	$('#add').click(function(){
		let task = $('#id_task');
		let date = $('#id_date');
		let time = $('#id_time');
		let taskError = $('#error_task');
		let dateCompletedError = $('#error_date_completed');
		let dateList = date.val().split('-').map(x => Number(x));
		let timeList = time.val().split(':').map(x => Number(x));
		let futureDateTime = new Date(dateList[0],dateList[1] -1 ,dateList[2],timeList[0],timeList[1]);
		let currentDateTime = new Date();
//				console.log(currentDateTime.toLocaleTimeString())
//				console.log(futureDateTime.toLocaleTimeString())
		console.log(futureDateTime > currentDateTime)
		if(task.val() && date.val() && time.val() && futureDateTime > currentDateTime){
			// Make an ajax request
			$.ajax({
				url: url,
				data: {
					'task': task.val(),
					'date': date.val(),
					'time': time.val(),
				},
				dataType: 'json',
				success: function(data){
					// Add the task to the list of tasks in progress
					let tasksInProgressCount = $('#tasks-in-progress-count');
					// A task is already present
					if(Number(tasksInProgressCount.text()) > 0){
						$('#tasks-in-progress').append(
							`<li class="list-group-item p-1 d-flex justify-content-between">
								<div>
									${task.val()}<br/>
									<span class="text-muted small">Completed By: ${futureDateTime.toUTCString()}</span>
								</div>
								<div class="d-flex align-items-center">
									<button id = "${data['task_id']}" class = 'btn btn-sm btn-success mr-1 complete'>Complete</button>
									<button id = "${data['task_id']}" class = 'btn btn-sm btn-danger'>Delete</button>
								</div>
							</li>`
						);

					}
					// This is a new task 
					else{
						$('#no-task-in-progress').slideUp(function(){
								$(this).remove();	
							}
						);
						// Add the task to the list
						$('#tasks-in-progress-container').append(
							`<ul id="tasks-in-progress" class="list-group list-group-flush">
								<li class="list-group-item p-1 d-flex justify-content-between">
									<div>
										${task.val()}<br/>
										<span class="text-muted small">Completed By: ${futureDateTime.toUTCString()}</span>
									</div>
									<div class="d-flex align-items-center">
										<button id = "${data['task_id']}" class = 'btn btn-sm btn-success mr-1 complete'>Complete</button>
										<button id = "${data['task_id']}" class = 'btn btn-sm btn-danger'>Delete</button>
									</div>
								</li>
							</ul>`
						);
					}
					// Increase the number of tasks in the container
					tasksInProgressCount.text(`${Number(tasksInProgressCount.text()) + 1}`);
					// Clear the errors and fields
					task.val('');
					date.val('');
					time.val('');
					taskError.text('');
					dateCompletedError.text('');
					// Add an event to the element's complete button
					$('.complete').last().click(completeTask);
				}
			});
		}
		else if(!task.val() && (date.val() || time.val())){
			taskError.text('You must specify the task you want to complete.');
			dateCompletedError.text('');
		}
		else if(task.val() && (!date.val() || !time.val())){
			dateCompletedError.text('You must specify the date and time you want to complete the task');
			taskError.text('');
		}
		else{
			taskError.text('You must specify the task you want to complete.');
			dateCompletedError.text('You must specify the date and time you want to complete the task');
		}
	});
} 

// A function that send a task in the task in progress container to the completed tasks container
function completeTask(){
	// Get the id of the task
	let taskId = $(this).attr('id');
//	console.log(taskId);
	let index = $('.complete').index(this);
	// Make an ajax request that will make the task completed
	$.ajax({
		url: 'http://localhost:8000/task/completed/',
		data: {
			taskId
		},
		dataType: 'json',
		success: function(data){
			// Remove the task from the task in progress container
			$('#tasks-in-progress .list-group-item').eq(index).slideUp(function(){
				$(this).remove();
				// Get the number of completed tasks
				let completedTasksCount = $('#completed-tasks-count');
				// This is not the first completed task
				if(Number(completedTasksCount.text()) > 0){
					// Get the completed task list and add a new completed task
					$('#completed-tasks').append(
						`<li class="list-group-item p-1 d-flex justify-content-between">
							<div>
								${data["action"]}<br/>
								<span class="text-muted small">Completed On: ${data["completed_on"]}</span>
							</div>
							<div class="d-flex align-items-center">
								<button id = "${data['task_id']}" class = 'btn btn-sm btn-danger'>Delete</button>
							</div>
						</li>`
					);
				}
				// This is the first completed task
				else{
					// Remove the default message when there is no completed task
					$('#no-completed-task').slideUp(function(){
						$(this).remove();
					});
					// Get the completed task comtainer and add a new completed task
					$('#completed-tasks-container').append(
						`<ul id="completed-tasks" class="list-group list-group-flush">
							<li class="list-group-item p-1 d-flex justify-content-between">
								<div>
									${data['action']}<br/>
									<span class="text-muted small">Completed On: ${data['completed_on']}</span>
								</div>
								<div class="d-flex align-items-center">
									<button id = "${data['task_id']}" class = 'btn btn-sm btn-danger'>Delete</button>
								</div>
							</li>
						</ul>`
					);
				}
				// Check if the task when removed will make the task in progress container empty
				let tasksInProgressCount = $('#tasks-in-progress-count');
				if(Number(tasksInProgressCount.text()) - 1 == 0){
					// Remove the list containing the tasks in progress
					$('#tasks-in-progress').remove();
					// Add the default message when there is no task in progress
					$('#tasks-in-progress-container').append(
						`<p id="no-task-in-progress" class="text-center text-muted lead">No Tasks In Progress</p>`
					);
				}
				// Decrease the tasks in progress count
				tasksInProgressCount.text(`${Number(tasksInProgressCount.text()) - 1}`);
				// Increase the completed tasks count
				completedTasksCount.text(`${Number(completedTasksCount.text()) + 1}`);
			});
		}
	}); 
	
}

// Invoke the function on every element which has a complete class
$('.complete').click(completeTask);