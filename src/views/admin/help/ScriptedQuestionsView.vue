<template>
	<div class="container-fluid">
		<Card>
			<template #title>Scripted questions</template>
			<template #content>
				<b>
					Scripted questions enable teacher to append custom scoring (grading) code/script at the end of the
					scoring pipeline!
				</b>
				<br />
				<br />
				If scripted questions are used, the scoring is performed as follows:
				<ol>
					<li>
						Edgar performs the built-in default scoring and forwards all the relevant data further down the
						pipeline
					</li>
					<li>
						Custom evaluation script written by the teacher is executed:
						<ul>
							<li>The script has the data from the step 1 at it's disposal</li>
							<li>
								The script must return the
								<b>score object</b>
							</li>
						</ul>
					</li>
				</ol>
				Thus, the teacher is in a position to
				<b>alter the default score</b>
				.
				<br />
				The script can be written in
				<b>arbitrary programming language</b>
				(supported by Edgar, eg. C, Java, Pyhton…) or Javascript, difference being:
				<ul>
					<li>
						<b>Javascript (recommended)</b>
						script is evaluated and executed in-process, at the web-server machine serving the request.
						<ul>
							<li>
								All relevant data is embedded in the script object and is available simply as
								this.something, no parsing or evaluating necessary
							</li>
							<li>
								Teacher must implement only the getScore() method which must return the (potentially
								altered) score.
							</li>
						</ul>
					</li>
					<li>
						Other programming languages (Java, C, …) scripts are being sent to the code-runner, ie to the
						Judge0 code execution engine – the very same used to evaluate students’ code. This means that
						Edgar invokes HTTP request to code-runner, which in turn passes the code to Judge0, where the
						code is compiled and executed in the sandbox
						<ul>
							<li>
								Relevant data is serialized as JSON and sent to the script as the single stdin argument.
								The script/program must deserialize the input in order to do anything useful.
							</li>
							<li>
								Teacher must return new score again, serialized as JSON, by writing that string to
								stdout. Edgar subsequently deserialized the stdout and proceeds.
							</li>
						</ul>
					</li>
				</ul>

				For all these reasons, RPC being dominant, JS scripts are much faster and are easier to write.
				<br />
				For instance, this is a valid JS script which simply appends to the hint (which students see in their
				feedback):
				<pre>
{
    getScore() {
        this.score.hint += " I was also here at " + (new Date()).toISOString(); 
        return this.score;    	
    }
}
</pre
				>
				Let’s describe the process via an example. Say we want the student to print the string “hello” to the
				stdout in C without using the printf function; solution being eg to use the puts function. We create a C
				programming question and provide a single test-case which determines whether the “hello” is printed out.
				However, this only takes care of that part, now we will write the JS script to check whether “printf”
				occurs anywhere in the student’s code:
				<pre>
{
    getScore() {
        let answer = this.record.student_answer_code || ''; // be defensive, student's code can be null if unanswered
        if (answer.indexOf("printf") >= 0) {
            return {
                is_correct: false,
                is_incorrect: true,
                score: this.record.gradingModel.incorrect_score,  // note the usage of grading model!
                score_perc: this.record.gradingModel.incorrect_score / this.record.gradingModel.correct_score,
                hint: "You can not use printf!", 
                c_outcome: this.score.c_outcome   // don't leave this out for code questions!
            };
        } else {
            this.score.hint += " I was also here at " + (new Date()).toISOString();  // just for fun
            return this.score;
        }    	
    }
}
</pre
				>
				Note that it is OK to change the existing object – you don’t have to create new one (example of both
				approaches is above).
				<br />
				Obviously, student’s code is in the this.record.student_answer_code variable, so what is the actual data
				structure that is forwarded to the script (serialized to JSON in non-JS scripts)?
				<br />
				The structure varies with regards to the question type, however the score and record fields will always
				be set:
				<pre>
{
    score: Score;  // always populated, default score precomputed by Edgar
    record: any;   // row from the DB with info about question, student's answers, etc.
    data?: any;    // this will containt the recordset for SQL questions
    success?: boolean; 
    db?: string;   // the name of the database where the SQL was executed    
    j0?: any;      // an array of j0 evaluated test-cases (for C, Java, … questions)
    error?: any; 
    dataObject?: any; // if TEMPLATES are used, there will be the data object here
    c_outcome?: any   // if Code questions are used, this will contain an array of test-case evaluation results WHICH ARE SHOWN TO THE STUDENT, so be careful not to lose this field when you return the new score
}
</pre
				>
				where Score is:
				<pre>
{
    is_correct: boolean = false;
    is_incorrect: boolean = false;
    is_unanswered: boolean = false;
    is_partial: boolean = false;
    score: number = 0;       // should be calculated using the gradingModel
    score_perc: number = 0;  // should be calculated using the gradingModel
    hint?: string;           // student will see this
}
</pre
				>
				And record will not be shown in the entirety here, only most interesting fields are listed:
				<pre>
{
    "type_name": "Code question",
    …
    "student_answer_code": "this is where code answer (C, Java, SQL, …) will be",
    "student_answer_text": "this is where free text answer will be",
    …
    "gradingModel": {  // grading model assigned by teacher in test def
      "correct_score": 1,
      "incorrect_score": -1,
      "unanswered_score": 0
    }
}
</pre
				>
				<br />
				One can see the entire object populated with values in the Edit question form.
				<br />
				<b>
					As with templates, the teacher can now damage the scoring process and so it is important to be
					careful and extensively test your scripts.
				</b>
				<hr />
				At last, note that templates combined with scripts make a very powerful combination!
				<br />
				Just as an example, one could make a free text question, and use a script to parse and score the
				submitted free text. For instance, we could randomly pick a float number, ask a student to convert it to
				eg IEEE754 (or binary, or hex, or whatever) and then programmatically determine the answer in the data
				object, which we finally check and score in the script. Hundreds of variations from a single question!
			</template>
		</Card>
	</div>
</template>
