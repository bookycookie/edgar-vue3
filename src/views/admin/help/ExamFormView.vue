<template>
	<div class="container-fluid">
		<Card>
			<template #title>
				Exam form
				<span class="text-xs">
					(please consult the Glossary for the definition of Exam, Exam instance and Grading model terms)
				</span>
			</template>
			<template #content>
				<Accordion multiple>
					<AccordionTab header="Flags (booleans)">
						<ul id="flags">
							<li>
								<b>Show solutions</b>
								- whether to show solutions to the questions in the review phase
							</li>
							<li>
								<b>Hint results (AKA "Kids mode")</b>
								- provide rich feedback to help students
							</li>
							<li>
								<b>Async submit</b>
								when ON, and when the student submits the exam: the submission is saved, and student
								gets a reply and is redirected to the overview of exams (while grading continues in a
								background thread). If OFF (sync), grading is done as a part of the
								save-grade-reply-redirect chain.
								<br />
								It is recommended to use SYNC for multiple-choice exams, and ASYNC for code exams.
							</li>
							<li>
								<b>Score ignored</b>
								- whether to ignore the score, used for DEMO and practice exams.
							</li>
							<li>
								<b>Forward only</b>
								- if ON, the students will not be able to go back and revisit questions, they can only
								move in one direction.
							</li>
							<li>
								<b>Anonymous stalk</b>
								- if ON, public URL for exam stalking will be enabled. This is used when staff that is
								NOT course staff is watching students as they write their exams and you want them to be
								able to see eg LOST FOCUSES and students' pictures and names. Public URL is constructed
								using the course and exam abbreviations, eg for course "Math1" and exam "E3" the URL
								would be: https://edgar.../stalk/math1/e3
								<br />
								It is made visible in All exam instances list.
							</li>
							<li>
								<b>Global</b>
								- if ON, the exam can be run from any academic year (you still **have to assign the
								valid from/to**). This is usefull when you want to avoid copying the exams from year to
								year, eg. a demo exam can be global and always available
							</li>
							<li>
								<b>Public</b>
								- if ON, the exam will be shown at the homescreen and students can simply start it
								without you communicating them the password. This is useful for eg homeworks and demo
								tests.
							</li>
						</ul>
					</AccordionTab>
					<AccordionTab header="Pace">
						<p>
							Pace is used to prevent students from over-submitting (running) their code.
							<br />
							Pace is defined via array of seconds which states how many seconds must student wait to be
							able to run code.
							<br />
							Eg. pace1 = [0, 0, 5, 10, 1e6] states that must wait:
						</p>

						<ul>
							<li>0 seconds before running the code for the first time</li>
							<li>0 seconds before running the code for the second time</li>
							<li>5 seconds before running the code for the third time</li>
							<li>10 seconds before running the code for the fourth time</li>
							<li>1e6 seconds before running the code for the fifth time - ie there is no fifth time</li>
						</ul>
						<br />
						Obviously, one can use pace to limit the maximum number of runs.
						<br />
						Pace can be used (and combined!) on two levels:
						<ul id="pace">
							<li>
								<b>Question pace</b>
								the pace array is applied to each individual question
							</li>
							<li>
								<b>Test pace</b>
								the pace array is applied with regards to the cummulative number of runs (of all
								questions)
							</li>
						</ul>
						When using two paces (question and test) the one with the longer wait times wins.
						<br />
						Example, let's say we have a test with two questions:
						<br />
						questionPace = [0, 5, 10, 15];
						<br />
						testPace = [0, 0, 30, 40];
						<br />
						Initial wait time is 0, ie student does not have to wait to run the question. Student runs:
						<ul>
							<li>Question 1 for the first time, now we get P = max(5, 0) = 5s</li>
							<li>Question 1 for the second time, now we get P = max(10, 30) = 30s</li>
							<li>
								Question 2 for the
								<b>first time</b>
								, now we get P = max(0, 40) = 40s
							</li>
						</ul>
						<br />
						Of course, you can use no pace, question pace, test pace or question & test pace.
					</AccordionTab>
				</Accordion>
			</template>
		</Card>
	</div>
</template>
