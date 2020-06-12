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
									<button class = 'btn btn-sm btn-success mr-1 complete'>Complete</button>
									<button class = 'btn btn-sm btn-danger'>Delete</button>
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
										<button class = 'btn btn-sm btn-success mr-1 complete'>Complete</button>
										<button class = 'btn btn-sm btn-danger'>Delete</button>
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
					$('.complete').last().click(go);
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
	
}