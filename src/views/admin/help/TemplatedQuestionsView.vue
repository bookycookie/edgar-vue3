<template>
	<div class="container mb-5">
		<h1>Question templates</h1>
		<br />
		Any question can be a templated question (mind the switch in the new question screen). Templates enable teachers
		to
		<b>inject dynamically generated content</b>
		into the:
		<ul>
			<li>Question text</li>
			<li>Answers (for multiple-choice questions)</li>
		</ul>

		Test-cases and correct answers (code and free text) are currently not supported. Edgar uses
		<a target="_blank" href="https://handlebarsjs.com/">Handlebars.js</a>
		as the templating engine, please consult the guide for more information. But, in a nutshell, handlebars replaces
		the expressions in double curly braces with values, for instance:
		<hr />
		The following template defines two Handlebars expressions:
		<pre v-pre>{{ x }} + {{ y }}</pre>
		If applied to the data object:
		<pre>
{
    x: 1,
    y: 2,
}
</pre
		>
		the expressions will be replaced by the corresponding properties. The result is then:
		<pre>
<p>1 + 2</p>
</pre>

		A template is rendered using the
		<b>context: an object</b>
		containing data (which is typically inserted into the template). Therefore, it is necessary to
		<b>firstly create the data object (context)</b>
		using Javascript programming language which will be used to render the template.
		<br />
		Let’s walk through the entire process using an example: say we want to create a multiple-choice question asking
		the student to add two numbers (eg. “Calculate 2+3?”). Of course, we’ll make the numbers dynamically generated
		i.e. we will pick numbers by random.
		<br />
		So, we first must define the data object which will hold the randomly generated numbers x and y and answers
		a1..a4. Similar to runtime constraints for code questions, Edgar provides a hierarchy of objects which are used
		to construct the final data object:
		<ul>
			<li>Global data object (not under your control, same for all courses)</li>
			<li>Course data object (under your control, initially null)</li>
			<li>Question data object (under your control, initially empty, containing just init() method)</li>
		</ul>
		This hierarchy facilitates the data object construction as the global and course data object (will) contain
		useful methods which the teacher can use in the question data object to initialize the object.
		<br />
		(their actual values/content can be seen in the Edit question form, in the log section of Data Object)
		<br />
		The final data object is constructed by merging all those objects and invoking the init() method on the final
		object.
		<br />
		In our example:
		<table>
			<tr>
				<td>
					Let say global data object is:
					<pre>
{
  randomInt: function(minInt, maxInt) {
    return Math.floor(Math.random() * (maxInt - minInt + 1)) + minInt;
  }
}
</pre
					>
				</td>
				<td>
					Let say course data object is:
					<pre>
{
  randomBoolean: function() {
    return !!this.randomInt(0, 1);
  },
  currAcYear: "2021/2022", 
  someOtherConstant: 42
}

</pre
					>
				</td>
				<td>
					Question data object is:
					<pre>
{
  init() {
    this.x = this.randomInt(13, 37);
    this.y = this.randomInt(133, 337);
    this.a1 = this.x + this.y;
    this.a2 = this.a1 - 1;
    this.a3 = this.a1 + this.randomInt(1, 5);
  }
}
</pre
					>
				</td>
			</tr>
		</table>

		Then the final data object will be assembled as:

		<pre>
{
  randomInt: function(minInt, maxInt) {
    return Math.floor(Math.random() * (maxInt - minInt + 1)) + minInt;
  }
  randomBoolean: function() {
    return !!this.randomInt(0, 1);
  },
  currAcYear: "2021/2022", 
  someOtherConstant: 42
  init() {
    this.x = this.randomInt(13, 37);
    this.y = this.randomInt(133, 337);
    this.a1 = this.x + this.y;
    this.a2 = this.a1 - 1;
    this.a3 = this.a1 + this.randomInt(1, 5);
  }
}
</pre
		>
		After the init() method is invoked, the object might look like this:
		<pre>
{
  "currAcYear": "2021/2022", 
  "someOtherConstant": 42
  "x": 31,
  "y": 203,
  "a1": 234,
  "a2": 233,
  "a3": 239
}
</pre
		>
		Now we have the context to render our template!
		<br />
		Finally, we simply define the question and answers as:
		<pre v-pre>
### Please calculate {{ x }} + {{ y }}?

a) {{ a1 }}
b) {{ a2 }}
c) {{ a3 }}
d) I don’t know

</pre
		>

		and we will get (of course, answers will be shuffled so that they are not always in the same order):
		<pre v-pre>
<h3>Please calculate 31 + 203?</h3>

a) 234
b) 233
c) 239
d) I don’t know
</pre>

		When rendering, Edgar will:
		<ol>
			<li>Evaluate data object</li>
			<li>Convert the markdown to HTML</li>
			<li>Compile the template and render the template using HTML and data object</li>
		</ol>

		These dynamic templated questions are generated when the student runs the exam and requests the question for the
		first time. The logic is as follows:

		<ul>
			<li>Get the question from the database</li>
			<li>If the question is NOT templated return the question to the client</li>
			<li>
				Otherwise, check if there is a generated and saved question (Edgar stores both HTML and data object)
				<ul>
					<li>If yes, return the previously generated questions (HTML)</li>
					<li>If no, generate the question, store it to the database and return the question</li>
				</ul>
			</li>
		</ul>

		<em>
			The question form has facilites to try the data object generation and template renedering. Still, a teacher
			is now in a postion to corrupt the question generation, so be careful - with great power comes great
			responsibility...
		</em>
	</div>
</template>
