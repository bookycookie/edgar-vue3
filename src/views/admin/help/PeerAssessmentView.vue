<script setup lang="ts">
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
</script>

<template>
	<div class="container">
		<h1>Peer Assessment</h1>
		<br />
		<Accordion multiple>
			<AccordionTab header="What is Peer Assessment?">
				"Peer assessment is an educational activity in which students judge the performance of their peers and
				it can take different forms depending on the characteristics of its implementation, the learners and the
				learning context.
				<br />
				Peer assessment can take different forms ranging from summative purposes (e.g., peer grading, peer
				evaluation) to formative purposes (e.g., peer feedback)."
				<br />
				--
				<a href="https://en.wikipedia.org/wiki/Peer_assessment" target="_blank">Wikipedia</a>
				<br />
				<br />
				Peer Assessment is Edgar is currently under construction.
				<br />
				It will be carried out in two phases, as described below.
			</AccordionTab>

			<AccordionTab
				header="Peer Assessment Phase #1 - Assignment definition and gathering of
            students' solutions.">
				<br />
				First, we need to define a test and an assignment (question). We will define a test with a single fixed
				free text question.
				<ul>
					<li>
						Go to:
						<b>Questions → Course structure: node graph and edit</b>
						and define a new "Peer assessment" node (e.g. under root node) if you already don't have it.
					</li>
					<li>
						Go to:
						<b>Questions → New question</b>
						: new free text question and assign it to "Peer assessment" node.
						<br />
						Define the assignment (question).
						<br />
						If your course has "show_attachments" flag ON, you will be able to attach a number of files to
						the question (e.g. images, project files, etc.).
					</li>
					<li>
						Go to:
						<b>Exams → Create new exam</b>
						: select "Peer assessment PHASE1" exam type
					</li>
					<li>
						In the exam definition:
						<ul>
							<li>Set no of questions to 1.</li>
							<li>
								Add the question from the "Peer assessment" node to the exam questions. Set some grading
								model, eg. 1/0/0
							</li>
							<li>
								Set Max score to the grading model max score, eg. 1. Since we're using free text
								questions (which are always evaluated as "correct") student will be awarded that one
								point. If you do not want to award the student, set Score ignored to on.
							</li>
							<li>Adjust the Upload files number and file size limits (default is 0 and 2MB).</li>
							<li>
								Adjust Title, abbreviation, password and available from/to. You can set Async submit to
								either on or off.
							</li>
							<li>Probably leave Max runs=1</li>
							<li>Save.</li>
						</ul>
					</li>
				</ul>
				Now, we have defined the test used for gathering solutions.
				<br />
				When the student run the test they will be able to:
				<ul>
					<li>See the free text question and enter free text (comment)</li>
					<li>Upload a defined number of files</li>
				</ul>
				<br />
				When they submit the test, their solution will be "graded" as correct (and possibly score-ignored).
				<br />
				Uploaded files will be zipped to a single file.
				<ul>
					<li>In test review they will see their free text</li>
					<li>and uploaded files (zip)</li>
				</ul>
				<br />
				Teachers can download the uploaded files in two ways:
				<ul>
					<li>One by one: by entering student's review exam page and downloading the zip</li>
					<li>
						Bulk download for the entire test - from the
						<b>Exams → All exam instances</b>
						menu.
					</li>
				</ul>
				Warnings:
				<ul>
					<li>
						Multiple question peer assessment test have not been tested. For the time being, please use
						one-test-one-question scheme.
					</li>
					<li>
						If max runs is greater than 1 and student uploads file1, file2 in the first run and file3 and
						file 4 in the second, when bulk download is employed all those files will be merged to a single
						user folder (containing file1-4) and possibly overwriting each other if they have the same names
						(eg. if in second run there was also file1)
					</li>
				</ul>
			</AccordionTab>
			<AccordionTab header="Peer Assessment Phase #2 - Shuffle and assessment">
				<br />
				In the 2nd phase students are assigned an arbitrary number of:
				<ul>
					<li>Other students' submissions (e.g. 4)</li>
					<li>Calibration submission (e.g. 1), crafted by teachers, to assess the assessment :)</li>
				</ul>
				<br />
				So, in this example, total of 5 (= 4 + 1) assessments.
				<br />
				Each of these five assessments will be carried out via a separate PA Phase#2 exam.
				<br />
				These N (e.g. five) exams will be
				<b>generated</b>
				from a single
				<b>master</b>
				PA test.
				<br />
				So, to carry out the second phase of the peer assessment one must:
				<ol>
					<li>
						Define a "master" PA test. This test will reference the phase 1 PA test and provide a "mold" for
						the generation of actaul exams (assessments) that the student will take.
					</li>
					<li>Generate acutal PA tests, and disseminate passwords to students.</li>
				</ol>
				<b>
					There is a hard rule here: generated PA tests MUST have ordinals immediatelly following the MASTER.
				</b>
				<b>
					E.g. if MASTER test has test_ordinal = 65 and you have 5 assessment questions, they will have
					ordinals 66-70.
				</b>
				<b>In other words - make sure you have N empty "slots/ordinals" after the MASTER's ordinal.</b>
				<hr />
				<h3>Master PA#2 exam</h3>
				<br />
				<br />
				First, prepare the question you want to ask students (regarding their assessment).
				<br />
				Typically, you will want to use "Scale" and "Free text" questions. Place them in a new node.
				<br />
				If you had more than one question in the PA#1 you will probably want to keep students in the
				question-groups.
				<br />
				E.g. let's add to our example that in the PA#1 students were assigned TWO random questions, so
				approximately 50% of students had PA1-Q1, and 50% PA-Q2.
				<br />
				In the PA2 we want the PA-Q1 students to assess other PA-Q1 students and the same with PA-Q2.
				<br />
				Assessment questions might also vary - eg PA-Q1 calls for 5 assessment question, and PA-Q2 calls for 7
				assessment questions.
				<br />
				It is a good idea to place those 5 and 7 questions in separate nodes.
				<br />
				Also, prepare the "Calibration" question(s), and place them in a separate node. Calibration questions
				are just wrappers for zip attachments (question text is ignored). Give the attachment a GUID name so
				that it is similar to the GUID names of students' zipped submissions. E.g. take this and change a few
				letters: e2ea0cb6-69ed-4a12-b061-bc5cc824e02a.zip
				<br />
				The same PA-Q1/Q2 principle applies for the calibration questions, you will probably want to place them
				in separate nodes.
				<br />
				<br />
				Then:
				<ul>
					<li>
						Go to:
						<b>Exams → Create new exam</b>
						: select "Peer assessment PHASE2 MASTER" exam type
					</li>
					<li>
						The upper half is standard - a test with FIXED questions. Add prepared questions, set password
						and timespans. You probably also want async=OFF.
						<br />
						For the time being, validation of PA#2 MASTER tests is disabled, so be careful.
						<br />
						Note: number of questions is ignored. Different PA1-Q1/Q2 groups may have different number of
						question and so this master number is ignored.
						<br />
						You CAN use grading model 0/0/0 and max_score 0 (as this kind of test will always be 100%
						"correct").
						<br />
						Save.
					</li>
					<li>
						In the 'Peer assessment properties' section:
						<ul>
							<li>select the PA#1 test,</li>
							<li>
								set
								<b>total</b>
								number of peer assignments (e.g. 5)
							</li>
							<li>
								set the number of calibration assignments and the node from which they will be randomly
								selected
							</li>
							<li>Save.</li>
							<li>
								Upon saving, Edgar will lookup the references PA1 test and find
								<b>distinct</b>
								questions from the PA1 (PA-Q1 and PA-Q2 in our example), and:
								<ul>
									<li>The corresponding number of tabs will be instantiated (e.g. two)</li>
									<li>
										On each tab, add fixed questions (from those nodes you prepared) to the
										corresponding PA1 question (the question is displayed on the tab).
									</li>
									<li>
										Side note: Fetch button fetches the questions from the selected nodes that are
										NOT used in the PA2 test, so you might want to press Fetch again after you add
										the question to narrow the list.
									</li>
									<li>Set grading models and save.</li>
								</ul>
							</li>
						</ul>
					</li>
					<li>
						In the 'Peer assessment properties' section:
						<ul>
							<li>
								Hit Shuffle (keep groups) or Shuffle (all together) button, you can do it N times. The
								shuffle is visualized. Once you're happy:
								<ul>
									<li>
										Keep groups keeps students binned to their PA1-question group. You probably want
										this.
									</li>
									<li>
										All together shuffles them all together, and so the PA-Q1 student might get a
										PA-Q2 student's answer to assess.
									</li>
								</ul>
							</li>
							<li>
								Hit Save shuffle button. You can repeat these two steps as much as you like,
								<b>but don't change the shuffle once the assessment has begun!</b>
								b>
							</li>
							<li>
								Generate the exams. Master password will be suffixed with the ordinal. You can
								re-generate these exams if you like.
								<br />
								Only "virgin" exams will be regenerated (from the master). You can access them via Exam
								definitions but they should not be changed individually.
								<br />
								You can of course "delete all instances" and regenerate all exams.
							</li>
							<li>You're done, disseminate the passwords.</li>
						</ul>
					</li>
				</ul>
			</AccordionTab>
			<AccordionTab header="Peer Assessment Analysis">
				TODO, under construction
				<img src="https://media.giphy.com/media/ZTans30ONaaIM/giphy.gif" />
			</AccordionTab>
		</Accordion>
	</div>
</template>
