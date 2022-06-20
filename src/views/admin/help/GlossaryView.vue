<template>
	<div class="container-fluid">
		<Card>
			<template #title>Glossary</template>
			<template #content>
				<Accordion multiple>
					<AccordionTab header="Exam">
						<ul id="glossary-test">
							<li>
								<b>Exam (definition)</b>
								is a definition of parameters (password, exam length, no of questions, question pool)
								needed to produce a exam for a student. (analogy - Class)
							</li>
							<li>
								Exam consists of a number (1..N) of
								<b>exam parts. Exam part</b>
								defines a question node that will be used as a pool of random questions. Exam part also
								defines a min/max number of questions drawn from the pool, pass percentage and grading
								model. Exam part has has "ordinal" field which is by default set to 0 for all test
								parts. This attribute defines the ordering of generated questions. If left default,
								question will be randomly ordered. Otherwise, questions will be ordered by the test part
								ordinal and randomly within the test part. In SQL dialect, one might say that generated
								questions will be ordered "BY test_part.ordinal, random()".
							</li>
							<li>
								<b>Exam instance</b>
								is a 'materialization' of a exam, always produced for a single student. Exam
								materialization usually involves random question selection (from a predefined
								pool).(analogy - Object)
							</li>
							<li>
								<b>Grading model</b>
								defines (correct points, incorrect points, unanswered points) triplets. Note that a
								single exam can have multiple exam parts having different models. One must take care
								that the cumulative number of points is correct and deterministic.
							</li>
						</ul>
					</AccordionTab>
					<AccordionTab header="Question">
						<ul id="glossary-question">
							<li>
								<b>Question</b>
								is a definition of a problem assignment, with the (hidden) correct answer. Currently,
								multiple-choice questions and SQL question are supported. Questions are written in
								GitHub markdown syntax (which supports tables). Additionally, Edgar supports images and
								inline TEX formulas via MathJax library (formulas must be enclosed in $$ tags.)
							</li>
							<li>
								Question belongs to a number of
								<b>question nodes</b>
								.
								<b>Question nodes</b>
								can have a number of parents and children, that is - they form a network (graph), and
								can be of arbitrary types (eg course, module, unit, ...).
								<b>Question nodes</b>
								are used to categorize questions in a manageable "bins" or "pools", see Exam parts
								above.
							</li>
						</ul>
					</AccordionTab>
					<AccordionTab header="Tutorial">
						<ul id="glossary-tutorial">
							<li>
								<b>Tutorial</b>
								is a definition of its title, description and steps that need to be completed in the
								given order by students to finish the tutorial.
								<br />
								A tutorial is assigned to the course where it is defined but can be assigned to multiple
								courses (not yet using the Web UI).
								<br />
								An active tutorial is listed to students in the assigned course(s) while inactive
								tutorials are not listed.
							</li>
							<li>
								<b>Steps</b>
								are defined by their title and text and usually explain a concept from the course
								material the tutorial is about. Every step contains one question (equal to the above
								described concept) that students need to solve correctly in order to proceed to the next
								tutorial step. Steps and questions contain several types of hint that can be active
								(shown to students when appropriate) or inactive (ignored).
							</li>
							<li>
								<b>Step hints</b>
								are defined as guidelines for students on how to solve the given question. A step can
								contain several step hints and they are shown to students on their request in the
								defined order.
							</li>
							<li>
								<b>Question hints</b>
								serve the same purpose, but are shown depending on student-supplied answer to the
								question. There are two types of step hints:
								<ul>
									<li>
										<b>Question answer hints</b>
										used in questions of (single or multiple choice) ABC question type. For each
										possible answer, a hint can be defined and shown if the student chose that
										answer.
									</li>
									<li>
										<b>Code question answer hints</b>
										used in code question types (SQL, C-Lang, Java...). The hints are shown if the
										given regular expression expression matches the student-supplied answer.
									</li>
								</ul>
							</li>
						</ul>
					</AccordionTab>
					<AccordionTab header="Exercise">
						<ul id="glossary-exercise">
							<li>
								<b>Exercise</b>
								is a definition of title, description, adaptivity model and set of question nodes that
								define the pool of questions that can be used in the exercise. Exercises serve as an
								adaptive learning experience for students, assigning questions of increasing
								difficulties as students advance with their question solving performance.
								<br />
								Question difficulties can be computed for questions with enough historical data, that
								is, if they were used in exams and student answers with their correctness were recorded.
								The data can be used with correct answer percentage and several
								<abbr title="Item Response Theory">IRT</abbr>
								models to give an estimate comparative difficulty level (with regard to all questions
								from the pool - nodes in the exercise definition).
								<br />
								The computed difficulties can further be used to automatically determine the assigned
								difficulty level. If available computed difficulty models mismatch for some questions,
								the difficulty should be assigned manually.
								<br />
								Active exercises are listed to students in the course where created, while inactive are
								not listed.
							</li>
							<li>
								<b>Adaptivity models</b>
								define:
								<ul>
									<li>
										Number and names of difficulty levels that can be assigned to questions (eg. 3
										levels: easy, normal and hard)
									</li>
									<li>
										Thresholds for each difficulty level to define when leveling up or down is
										performed. (eg. to level up from easy to normal, from 5 consecutive answers, 3
										or more must be correct)
									</li>
								</ul>
							</li>
							<li>
								<b>ICC - Item Characteristic Curve</b>
								represent the probability of correctly answering an item (question) for different values
								of student latent trait (proficiency). They are logistic (Sigmoidal) curves bounded by 0
								and 1.
								<br />
								Two logistic models can be used:
								<dl>
									<dt>1-parameter logistic model (Rasch)</dt>
									<dd>
										Uses only difficulty parameter (
										<var>b</var>
										)
									</dd>
									<dt>2-parameter logistic model (Lord)</dt>
									<dd>
										Uses two parameters: difficulty (
										<var>b</var>
										) and discrimination (
										<var>a</var>
										)
									</dd>
								</dl>
								The difficulty of the item (
								<var>b</var>
								) can be visualized as the point of inflection on the proficiency scale. Curves shifted
								to the left (right) indicate easier (more difficult) items. Alternatively, the
								discrimination parameter (
								<var>a</var>
								) is depicted by the slope of the curve. For reasonable values of
								<var>a</var>
								, steeper slopes indicate items that are better able to differentiate between students
								of lower and higher proficiency.
							</li>
						</ul>
					</AccordionTab>
				</Accordion>
			</template>
		</Card>
	</div>
</template>
