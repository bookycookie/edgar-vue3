<template>
	<div class="container">
		<h1>Manual grading</h1>
		<p>
			Manual grading can be used to grade questions that cannot be graded automatically or to override the initial
			grade obtained through automatic grading. When using manual grading, there are two datasets:
		</p>
		<ol>
			<li>
				Original scores that are computed (or assigned 0) on submit, this is the dataset that student sees in
				the review phase
			</li>
			<li>
				"Manual grades" - similar dataset hidden from students. You can regard this as teachers-only excel file
				to be populated through manual grading
			</li>
		</ol>
		Usually, you want to initialize the second set with the values from the first set.
		<br />
		This is performed using "Initalize manual grades with submitted scores" button.
		<br />
		You can safely click on this button multiple times, as it will NOT overwrite any potential manual scores if
		there are any.
		<p></p>

		The usual workflow is as follows:

		<ul>
			<li>
				After all students have submitted their exams, go to Exam -&gt; All exam instances, and select the
				manual grading icon for the exam you want to grade
			</li>
			<li>
				Typically "Initalize manual grades with submitted scores" to apply any automated scores.
				<br />
				Now you have a working copy of the data.
				<br />
				Edit exam and reset review minutes to 0 so that students can not enter the review of their exams (you
				will set this value to the appropriate number of minutes again at the end of the process)
			</li>
			<li>
				Divide the work among TAs. Say there are three TAs, assigne surname ranges, e.g.:
				<ul>
					<li>TA1 A-K</li>
					<li>TA2 L-M</li>
					<li>TA3 M-</li>
				</ul>
			</li>
			<li>
				TA1 now sets their range ("Last name from", "Last name to" -&gt; Set filter) to A and K.
				<br />
				The manual grading dataset is now scoped to A-K subset.
				<br />
				(and same for the TA2, 3, ...)
			</li>
			<li>
				It is now up to TA1 whether they want to grade by students (whole exam by whole exam) or by question
				("horizontally", eg. first question, then second etc.)
				<br />
				TA selects the rows (student-questions) using the table filtering options, column ordering and
				(de)select up buttons and then hits "Generate grading form"
				<br />
				For instance, if TA wants to grade horizontally then enter the question id in the filter text box right
				above the table, select all (or part) and then "generate grading form"
				<br />
				Note that TAs can also opt to divide work by questions and not alphabetically, eg. TA1 question 1-3, TA2
				questions 4-5, ...
				<br />
				All such combinations are elegantly supported with this framework.
			</li>
			<li>
				Iterate questions on a newly generated form and assign grades and comments.
				<br />
				Beware - comments are written directly to the original dataset, that is why it is better to turn off
				review while the manaul grading process is not done.
				<br />
				Grading form has several floating buttons to help toggle question texts, answers, submitted images, etc.
				Try them out.
				<br />
				Also, if student has uploaded jpg, png, doc(x) or pdf, even if they are zipped, Edgar will unzip them
				and show inline in the form.
			</li>
			<li>
				When all the TAs have graded their exams, consider the stats button (next to the "generate grading
				form")
				<br />
				If there are notable discrepancies between graders, you might want to reiterate previous few steps.
			</li>
			<li>
				Once you are satisfied with the manual grades you can publish the results:
				<ul>
					<li>
						Click "Apply manual grading" red button which overwrites the first (original) dataset with
						manual grades.
					</li>
					<li>
						Adjust the "Rvw period (min)" setting in the exam to the appropriate value (it is counted from
						the submission timestamp)
					</li>
					<li>
						Potentially adjust "Ticket policy" to (dis)allow students raising tickets in the review phase.
					</li>
					<li>Potentially adjust "Show solutions" to ON.</li>
					<li>
						Invite students to see their results. They will see the scores, who graded them, and grader's
						comments.
					</li>
				</ul>
			</li>
		</ul>
	</div>
</template>
