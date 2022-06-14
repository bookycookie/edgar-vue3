<template>
	<div class="container mb-5">
		<h1>Ticketing system</h1>
		<br />
		<p>
			Edgar provides a lightweight ticketing system to facilitate the communication of students and staff during
			the exams. Each course has a flag that determines whether the course wants to use the ticketing system.
			Students can raise tickets for suspected bugs in the exam questions directly from the single page exam
			application. The process goes as follows:
		</p>
		<ul>
			<li>
				Student clicks on the bug icon in the upper right side of the question page and provides text
				description of the issue. This creates the ticket with the OPEN state. The bug button changes state to
				disabled and color to red and displays the hourglass. Student continues with their exam.v
			</li>
			<li>
				Teachers monitor the tickets for the selected test (instances) via dedicated page that is accessed from
				the “All test instances” page. The page can be set to refresh itself every N seconds. The page lists all
				tickets and their states and assigned teachers (initially none). To handle the ticket, the teacher must
				first assign the ticket to themselves.
			</li>
			<li>
				Using the same page, teacher can provide an answer and close the ticket. That makes ticket CLOSED. Edgar
				internally queues a message for the student which will be picked up by the student’s heartbeat request
				issued by exam application (by default, heartbeat is issued every 60 seconds).
			</li>
			<li>
				Student receives the notification about closed ticket and can see the entire conversation via newly
				shown togglable callout button just below the bug button. Conversation is retrieved using ajax request
				every time student clicks on the callout.
			</li>
			<li>
				Bug(ticket) button is again enabled, and student can reopen the ticket which puts the ticket state to
				REOPENED and the process continues in the similar fashion with the exception that the teacher does not
				have to assign themselves to such ticket anymore – they are forever assigned to that ticket.
			</li>
		</ul>
		The image shows the ticket states and actors.
		<br />
		Buttons and state badges in application change colors accordingly.
		<br />
		Limitations: ticketing system supports only plain text. It is not possible to use images, tables, etc.
		<br />
		<br />
		<img class="center" src="/images/help/TicketingStates.png" />
		<br />
		Ticketing is also possible in the review phase! The same principles apply.
		<hr />
		<br />
		Students can also see their tickets from Exams->My tickets
		<br />
		Teachers can see the tickets they raised (as students) and tickets assigned to them also from Exams->My tickets.
	</div>
</template>
