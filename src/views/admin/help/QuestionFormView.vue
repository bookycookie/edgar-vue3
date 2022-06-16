<template>
	<div class="container">
		<h1>Question form items</h1>
		<br />
		<Accordion>
			<AccordionTab
				header="1. What is the meaning of numbers (default = 100) assigned to each
            answer in multiple choice (ABC) questions or code questions?">
				These numbers are called "penalty percentages".
				<br />
				They state how much (in percent)
				<b>to deduct</b>
				if the student's answer differs from the correct answer.
				<br />
				They are always combined with the following rule:
				<b>maximum (cummulative) deduct percentage is 100%.</b>
				<br />
				In other words, should those precentages exceed 100% they are trimmed to 100%.
				<br />
				Note that they are meaningful for both correct and incorrect answers.

				<br />
				Such representation allows for many different grading models.
				<br />
				Let's explain the entire grading algorithm with an example. To grade an MC question we must have:
				<ul>
					<li>Grading model (GM), (eg 15/0/-5). GM is defined on the exam level (see Glossary)</li>
					<li>An array of correct/incorrect answers/flags</li>
					<li>Student's answer - again, an array of correct/incorrect answers/flags</li>
					<li>An array of penalty percentages</li>
				</ul>
				The grade is evaluated as follows:
				<ol>
					<li>
						If the student's answer array is
						<b>empty</b>
						ie, the student did not answer the question
						<ul>
							<li>Question is awarded "unanswered points" defined in the GM, in our example - 0</li>
						</ul>
					</li>
					<li>
						If the answer array is
						<b>NON empty</b>

						<ul>
							<li>
								CALCULATE the overall SUM_penalty_perc: line up the arrays and sum penalty percentages
								in the misalligned rows, eg:
								<table>
									<tr>
										<th>#</th>
										<th>correct</th>
										<th>student</th>
										<th>penalty percentage</th>
										<th>to deduct</th>
									</tr>
									<tr>
										<td>a</td>
										<td>C</td>
										<td>C</td>
										<td>100</td>
										<td></td>
									</tr>
									<tr>
										<td>b</td>
										<td>I</td>
										<td>C</td>
										<td>100</td>
										<td>100</td>
									</tr>
									<tr>
										<td>c</td>
										<td>C</td>
										<td>I</td>
										<td>100</td>
										<td>100</td>
									</tr>
									<tr>
										<td>d</td>
										<td>I</td>
										<td>I</td>
										<td>100</td>
										<td></td>
									</tr>
									<tr>
										<td>e</td>
										<td>I</td>
										<td>I</td>
										<td>100</td>
										<td></td>
									</tr>
									<tr>
										<td colspan="4">SUM:</td>
										<td>200</td>
									</tr>
									<tr>
										<td colspan="4">TRIM to 100%:</td>
										<td>100</td>
									</tr>
								</table>
							</li>
							<li>
								Using GM and SUM_penalty_perc determine the score:
								<br />
								score := GM.correct_points - SUM_penalty_perc * (GM.correct_points -
								GM.incorrect_points)
								<br />
								score = 15 - 100% * (15 - -5) = 15 - 100% * 20 = -5
								<br />
								Note that the SUM_penalty_perc is applied to the entire range from min to max
								<br />
								score% := score / GM.correct_points
								<br />
								score% := -5 / 15 = -33.33%
							</li>
						</ul>
						This model (example) when all PPs are 100 requires everything to be correct, ie it is an all or
						nothing approach.
						<br />
						Try to calculate the score if PPs in the example above were [100, 10, 50, 50, 50] and try to
						explain such approach.
					</li>
				</ol>
			</AccordionTab>
			<AccordionTab
				header="2. What is the meaning of 'trim trailing whitespace' option in code
            test-cases?">
				First of all, before any comparisons, all CR+LFs are normalized to LFs.
				<br />
				The interpretation is to remove all trailing whitespace in every line and all whitespace after the last
				line.
				<br />
				Such whitespace is not visible on the screen and is hard to debug - the idea is to remove the
				"invisible" whitespace.
				<br />
				The image bellow shows an example of removed (yellow) whitespace. Obviously, whitespace is marked with
				dot.
				<br />
				<img src="/images/help/ttw1.png" />
				<br />
				...or, if you prefer code:
				<br />
				<img src="/images/help/ttw2.png" />
			</AccordionTab>
			<AccordionTab header="3. What are MD enhancers?">
				MarkDown enhancers are custom tags written as HTML comments that enhance the MD functionality. These
				enhancers are currently implemented (the list will probably expand):
				<ul>
					<li>
						<h5>Collapse MD enhancer (=show/hide content)</h5>
						If you enclose some MD with:
						<pre>&lt;!-- collapse title="Show/hide something"--></pre>
						<pre>md/html content here</pre>
						<pre>&lt;!-- /collapse --></pre>
						then the enclosed content will be initally hidden and a button will be rendered with the
						assigned title (or "Show" if omitted) - the button toggles the content visibility, that is
						(un)collapse the content.
					</li>
				</ul>
			</AccordionTab>
		</Accordion>
	</div>
</template>
