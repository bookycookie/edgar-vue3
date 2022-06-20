<template>
	<div class="container-fluid">
		<Card>
			<template #title>FAQ: How can I..</template>
			<template #content>
				<Accordion>
					<AccordionTab header="1. Review student's exam">
						<ol>
							<li>
								If the student
								<b>submitted</b>
								the exam
								<ul>
									<li>
										Go to:
										<b>Exams → All exam instances</b>
									</li>
									<li>
										Find the exam you want to review (please note the Search field above the table,
										to the right)
									</li>
									<li>
										Click on the
										<b>Submitted</b>
										button
									</li>
									<li>
										Find the student (please note the Search field above the table, to the right)
									</li>
									<li>
										Click
										<b>Review</b>
									</li>
									<li>
										Now ou can see the overall info of the student's exam, to see actual question
										click
										<b>Review</b>
										again.
									</li>
								</ul>
							</li>
							<li>
								If the student
								<b>did not submit</b>
								the exam, ie. exam is
								<b>ongoing</b>
								<ul>
									<li>
										Go to:
										<b>Exams → All exam instances</b>
									</li>
									<li>
										Find the exam you want to review (please note the Search field above the table,
										to the right)
									</li>
									<li>
										Click on the
										<b>Ongoing</b>
										button
									</li>
									<li>Find the student (students are grouped in tabs based on their IP's)</li>
									<li>
										Click
										<b>Stalk</b>
									</li>
									<li>
										Now you can see the ongoing info of the student's exam, along with current
										answers and links to questions.
									</li>
								</ul>
							</li>
						</ol>
					</AccordionTab>
					<AccordionTab header="2. Delete or unsubmit student's exam">
						<ol>
							<li>
								If the student
								<b>submitted</b>
								the exam
								<ul>
									<li>
										Go to:
										<b>Exams → All exam instances</b>
									</li>
									<li>
										Find the exam you want to review (please note the Search field above the table,
										to the right)
									</li>
									<li>
										Click on the
										<b>Submitted</b>
										button
									</li>
									<li>
										Find the student (please note the Search field above the table, to the right)
									</li>
									<li>
										Click
										<b>Delete</b>
										or
										<b>Unsubmit</b>
									</li>
								</ul>
								If you unsubmit the submitted exam, it becomes "ongoing". You can impersonate the
								student and submit it manually.
							</li>
							<li>
								If the student
								<b>did not submit</b>
								the exam, ie. exam is
								<b>ongoing</b>
								<ul>
									<li>
										Go to:
										<b>Exams → All exam instances</b>
									</li>
									<li>
										Find the exam you want to review (please note the Search field above the table,
										to the right)
									</li>
									<li>
										Click on the
										<b>Ongoing</b>
										button
									</li>
									<li>Find the student (students are grouped in tabs based on their IP's)</li>
									<li>
										Click
										<b>Delete</b>
									</li>
								</ul>
								If you delete the ongoing exam, the next time student starts that exam it will be
								generated ab ovo.
							</li>
						</ol>
					</AccordionTab>
					<AccordionTab header="3. Submit the student's exam">
						<ul>
							<li>
								First, you have to get the exam into the "ongoing" state (if it already isn't). That is:
								you have to start it, or unsubmit it (see 2.)
							</li>
							<li>
								(Also, you might want to fire up a different session so to have another screen where you
								are stil Teacher and can see everything)
							</li>
							<li>
								<b>Impersonate</b>
								the student: see 5.
							</li>
							<li>
								Start the exam (ie continue the ongoing exam) from
								<b>Exams → Start exam (or continue ongoing...)</b>
							</li>
							<li>
								You can change student's answers if you want now. If they are not persisted (ie. empty),
								you can Stalk the exam from the Teacher session and find the student's last answers in
								the Event log (see 1.2.)
							</li>
							<li>
								Click
								<b>Submit</b>
							</li>
						</ul>
					</AccordionTab>
					<AccordionTab header="4. Accept student's answers (ie award points)">
						<ul>
							<li>
								First, you have to find the question that you want to award points for, you can do that
								by:
							</li>
							<ul>
								<li>
									By reviewing the student's exam (see 1.). There is a link to the question in both
									cases (whether it is ongoing or submitted)
								</li>
								<li>
									Find the question yourself via Questions → Search, or you may know the link already
									(eg. somebody mailed it to you)
								</li>
							</ul>

							<li>
								In the "edit question" form, click
								<b>Toggle header</b>
								to show the question's header (if it is not already shown)
							</li>
							<li>
								Click on the
								<b>Used: N time(s)</b>
								link
							</li>
							<li>
								To award points for a single student just click on the
								<b>Accept</b>
								button in the corresponding row
							</li>
							<li>
								To award points to multiple students, you have to manually calculate "the delta" - how
								many point you want to award.
								<br />
								Be careful to compensate for the potential negative points.
								<br />
								It is best to treat unanswered and incorrect questions in different batches if the
								grading model allowed for negative points because they will need different deltas.
								<br />
								When you calculate the delta, type it in, give a reason, check a number of rows and
								click
								<b>Modify score by delta</b>
							</li>
						</ul>
					</AccordionTab>
					<AccordionTab header="5. Impersonate a student">
						<ul>
							<li>
								Go to
								<b>Administration → Students (list)</b>
							</li>
							<li>Find the student (please note the Search field above the table, to the right)</li>
							<li>
								Click
								<b>Impersonate</b>
							</li>
						</ul>
						After you've impersonated a student to return to your true self :), you have to logout and login
						again.
					</AccordionTab>
					<AccordionTab header="6. Update my picture (please do...)">
						First of all, as a teacher you actually have two personas.
						<br />
						The first is the teacher, and the second is your student alterego (which is used for writing
						exams).
						<br />
						In other words, you can set two (different) pictures. You'll see the student alterego image when
						you write exam.
						<ul>
							<li>
								Go to
								<b>Administration → Upload images (faces)</b>
							</li>
							<li>
								Provide the 70x70px image in the .jpg format, named accordingly (mind the case, "jpg" !=
								"JPG"), and upload it.
							</li>
						</ul>
						You can see the alt_id fields for teachers and students in the corresponding forms in the
						Administration menu.
					</AccordionTab>
				</Accordion>
			</template>
		</Card>
	</div>
</template>
