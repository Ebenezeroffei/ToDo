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
						console.log("I am more than one");
						$('#tasks-in-progress').append(
							`<li class="list-group-item p-1 d-flex justify-content-between">
								<div>
									${task.val()}<br/>
									<span class="text-muted small">Completed By: ${futureDateTime.toUTCString()}</span>
								</div>
								<div class="d-flex align-items-center">
									<button id = "${data['task_id']}" class = 'btn btn-sm btn-success mr-1 complete'>Complete</button>
									<button id = "${data['task_id']}" class = 'btn btn-sm btn-danger delete'>Delete</button>
								</div>
							</li>`
						);

					}
					// This is a new task 
					else{
						console.log("I am less than one")
						$('#no-task-in-progress').slideUp(function(){
								$(this).remove();	
							}
						);
						let capitalize = (x) => x[0].toUpperCase()+x.slice(1,);
+						// Add the task to the list
						$('#tasks-in-progress-container').append(
							`<ul id="tasks-in-progress" class="list-group list-group-flush">
								<li class="list-group-item p-1 d-flex justify-content-between">
									<div>
										${capitalize(task.val())}<br/>
										<span class="text-muted small">Completed By: ${futureDateTime.toUTCString()}</span>
									</div>
									<div class="d-flex align-items-center">
										<button id = "${data['task_id']}" class = 'btn btn-sm btn-success mr-1 complete'>Complete</button>
										<button id = "${data['task_id']}" class = 'btn btn-sm btn-danger delete'>Delete</button>
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
					// Add an event to the element's delete button
					$('#tasks-in-progress .delete').last().click(deleteTask);
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
								<button id = "${data['task_id']}" class = 'btn btn-sm btn-danger delete'>Delete</button>
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
									<button id = "${data['task_id']}" class = 'btn btn-sm btn-danger delete'>Delete</button>
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
						`<p id="no-task-in-progress" class="text-center text-muted lead m-2">No Tasks In Progress</p>`
					);
				}
				// Decrease the tasks in progress count
				tasksInProgressCount.text(`${Number(tasksInProgressCount.text()) - 1}`);
				// Increase the completed tasks count
				completedTasksCount.text(`${Number(completedTasksCount.text()) + 1}`);
				// Add an event to the element's delete button
				$('#completed-tasks .delete').last().click(deleteTask);
		});
		}
	}); 
	
}

// Invoke the function on every element which has a complete class
$('.complete').click(completeTask);

// A function that deletes a task
function deleteTask(){
	let taskId = $(this).attr('id');
	let task = $(this);
	// Make an ajax request that will delete the task
	$.ajax({
		url: 'http://localhost:8000/task/delete/',
		data: {
			taskId,
		},
		dataType: 'json',
		success: function(){
			task.parent().parent().slideUp(function(){
				// Get the number of tasks
				let taskCount = $(this).parent().parent().parent().find('div.card-header span.badge');
				// Get the type of task
				let taskType = $(this).parent().parent().parent().find('div.card-header').text().split(' ')
				taskType.pop();
				// The task beign deleted is the last task in the type of task
				if(Number(taskCount.text()) - 1 == 0){
					// Get the tasks list and remove it
					$(`#${taskType.join('-').trim().toLowerCase()}`).remove()
					console.log(taskType[0])
					// Get the id of the default message when there is no tak in the container
					let defaultId = 'no-uncompleted-task';
					if(taskType[0].trim() === 'Tasks'){
						defaultId = 'no-task-in-progress';
					}
					else if(taskType[0].trim() === 'Completed'){
						defaultId = 'no-completed-task';
					}
					// Get the task type container 
					$(`#${taskType.join('-').trim().toLowerCase()}-container`).append(
						`<p id = '${defaultId}' class="text-center text-muted mt-2 lead">No ${taskType.join(' ').trim()}</p>`
					); // Give it the default message when there is no task
				}
				// Decrease the task count
				taskCount.text(`${Number(taskCount.text()) - 1}`);
				// Remove the task
				$(this).remove();
			});
		}
	});
}
// Invoke the function on all elements that have a class of delete
$('.delete').click(deleteTask);

// A function that adds a task in progress to an uncompleted task within an hour
let closeToDeadline = () => {
	let deadlines;
	let secondsCount = 0;
	// Make an ajax request that will get all the tasks which the deadlines are less than an hour
	$.ajax({
		url: 'http://localhost:8000/task/deadlines/',
		data: {},
		dataType: 'json',
		success: function(data){
			deadlines = data;
			if(Object.keys(deadlines).length > 0){
				let deadlineTimer = setInterval(function(){
					// Go through every deadline
					for(let i of Object.keys(deadlines)){
						if(deadlines[i] - 1 == 0){
							// Invoke the function that will modify the 		uncompleted tasks section
							uncompleteTask(i);
							clearInterval(deadlineTimer);
						}
						deadlines[i]--; // Decrease it by a second
					}
					console.log(deadlines);
				},1000);	
			}
		}
	});
} 

closeToDeadline() // Invoke the function

// A function that adds a task to the uncompleted tasks section
let uncompleteTask = (taskId) => {
	console.log('I have been called')
	// Get the number of uncompleted tasks
	let taskCount = $('#uncompleted-tasks-count');
	// Make an ajax request that will get the details of a task using its id
	$.ajax({
		url: '',
		data: {
			taskId
		},
		dataType: 'json',
		success: function(data){
			// Remove the task from the tasks in progress container
			$(`#${taskId}`).parent().parent().slideUp(function(){
				$(this).remove()
				let taskInProgressCount = $('#tasks-in-progress-count');
				// Check if there is only one task in the task in progress section
				if(Number(taskInProgress.text()) === 1){
					$('#tasks-in-progress').remove();
					$('#tasks-in-progress-container').append(
						`<p id="no-task-in-progress" class="text-center text-muted mt-2 lead">No Tasks In Progress</p>`
					);
				}
				// Reduce the number of tasks in the tasks in progress section
				taskInProgressCount.text(`${Number(taskInProgressCount.text()) - 1}`);
			});
			// An uncompleted task is already present
			if(Number(taskCount.text()) > 0){
				$('#uncompleted-tasks').append(
					`<li class="list-group-item p-1 d-flex justify-content-between">
						<div>
							${data['action']}<br/>
							<span class="text-muted small">Completed By: ${data['completed_by']}</span>
						</div>
						<div class="d-flex align-items-center">
							<button id = "${taskId}" class = 'btn btn-sm btn-danger delete'>Delete</button>
						</div>
					</li>`
				);
			}
			// This is the first uncompleted task
			else{
				$('#uncompleted-tasks-container').append(
					`<ul class = 'list-group' id = 'uncompleted-tasks'>
						<li class="list-group-item p-1 d-flex justify-content-between">
							<div>
								${data['action']}<br/>
								<span class="text-muted small">Completed By: ${data['completed_by']}</span>
							</div>
							<div class="d-flex align-items-center">
								<button id = "${taskId}" class = 'btn btn-sm btn-danger delete'>Delete</button>
							</div>
						</li>
					</ul>`
				);
			}
			// Increase the task count
			taskCount.text(`${Number(taskCount.text()) + 1}`);
			// Add a delete event to the new task
			$('#uncompleted-tasks .delete').last().click(deleteTask);
		}
	});
}