# Engineering Intern Interview Questions

## Contents

-   Code Review
    -   Code comments
    -   Follow-up Questions
-   Coding Challenge
    -   Follow-up questions

------------------------------------------------------------------------

# Code Review

## Code comments

### Security Vulnerabilities

TLDR:   SQL Injection, Timing Attacks, Length Extension Attacks

1.  SQL Injection
    -   Line(s): 42, 47
    -   Suggestion: Use parameterized queries instead of f-strings
                    to avoid potential string escapes.
2.  Timing Attacks
    -   Line(s): 20
    -   Suggestion: Use a constant-time comparison function to
                    avoid giving an attacker the option to test
                    character by character.
3.  Length Extension Attacks
    -   Line(s): 17-19
    -   Suggestion: Use the hmac library to generate the hash and
                    avoid string concatenation.

### Logic & Architectural Issues

TLDR:   Missing Upsert Logic, Database Connections,
        Hardcoded Dev Secret

1.  Missing Upsert Logic
    -   Line(s): 46-48
    -   Suggestion: Use ON CONFLICT to upsert as intended.
2.  Database Connections
    -   Line(s): 37
    -   Suggestion: Use a context manager to close db even when an
                    error occurs.
3.  Hardcoded Dev Secret
    -   Line(s): 30
    -   Suggestion: Do not provide a default so that if the secret
                    is missing, an error should be raised and the
                    app will refuse to start.

------------------------------------------------------------------------

## Follow-up Questions

1.  Prompt: I am reviewing a Flask PR for a webhook endpoint. Below are
            the code and the requirements. Think like a senior engineer
            and indentify security vulnerabilities and logic errors.

            Code:
                            (pasted code)
            
            Requirements:
                        (pasted requirements)

    -   I was hoping for the AI to provide me with a concrete list of
        vulnerabilities and errors from the provided PR code.
    -   It gave me partially what I was looking for. The first part
        consisted of a list of vulnerabilities and errors, but it
        also provided me with a full fix of the PR.
    -   I did not re-prompt it because of my intended second prompt,
        building off of this one.
    -   I didn't change my approach.

2.  Prompt: From the identified security vulnerabilities and logic
            errors, provide line numbers, explain why they are a
            risk, and the best solution for them. Display your
            thoughts with clarity and go through each issue one by one.

    -   With the given context from the first prompt, I wanted the LLM
        to go in more detail with what issues they've previously
        pointed out so I could understand better, as well as separate
        the solutions to provide clarity.
    -   It almost gave me exactly what I was looking for. The line
        numbers were a little off, but everything else was perfect.
    -   I did not re-prompt it.
    -   I didn't change my approach.

------------------------------------------------------------------------

# Coding Challenge

## Follow-up questions

1.  I got pretty far in this exercise with the given time. Most of the
    time was spent documenting my results in this markdown file.
2.  Determining when to renew an LLM chat to remove chat history and
    reduce context versus keep context for easier communication was
    difficult. Through this exercise, though, I think I've found the
    sweet spot for the LLM model I was using.
3.  I think the next step up from my current web application would be
    to transition the scientific calculator into more of a graphing
    calculator. This would involve complexities in graphing, as well as
    data storage for equations. Computation regarding variables also
    adds more complexity in implementation.

### Prompts

1.  Prompt: Design a calculator web application. Construct your response
            in an LLM prompt so that I can copy and paste it. Think like
            a senior software engineer and design it with system design
            in mind. Keep the design simple so that an LLM can fully
            flesh out the design in one go, but complex enough so that
            the solution is non-obvious. Be sure to include all the
            details so the LLM will have all the context it needs to do
            as intended.
    -   Did well:   It did exactly what was asked of it. The resulting
                    LLM prompt had clear structure that allowed me to
                    determine if any changes should be made before
                    passing it on to the LLM again.
    -   Did poorly: The only thing I can criticize the response on would
                    be that the copy and paste formatting lost the
                    structure of the numbered list and bullet points.
    -   I specified the copy and paste formatting that I wanted.

2.  Prompt: Role: You are a Senior Full-Stack Engineer. Your task is to
            architect and implement a production-ready, responsive
            Calculator Web Application.

            System Design Architecture:
            1.  Pattern: Use the Command Pattern for the logic engine.
                Every operation (add, subtract, etc.) must be an object.
                This is required to support the Undo/Redo functionality.
            2.  State Management: Maintain a central CalculatorState
                object that tracks the current operand, the previous
                operand, the pending operator, and a historyStack.
            3.  Persistence: Implement a local history feature. Use
                JavaScript’s LocalStorage to ensure the calculation
                history persists across page refreshes.

            Technical Specifications:
            -   Frontend: Single-page application using Semantic HTML5,
                Modern CSS (Flexbox/Grid), and Vanilla JavaScript (ES6+).
            -   UI/UX: Design a "Dark Mode" sleek interface inspired by
                modern dashboard aesthetics. It must include:
                -   A primary display for the current number.
                -   A secondary "ghost" display for the current expression.
                -   A scrollable "History Sidebar" that shows past calculations.
            -   Math Logic: Support basic arithmetic (+, -, *, /) plus
                advanced operations: exponentiation (x^y), square root (√),
                and percentage (%).
            -   Edge Case Handling: Implement strict logic for division by
                zero (return a custom error message), floating-point precision
                (e.g., 0.1 + 0.2), and character limits for the display.

            Features to Implement:
            1.  Standard Calculator Functions: Full keypad support (mouse
                click and keyboard listeners).
            2.  Undo/Redo System: Users should be able to step backward and
                forward through their current session's operations.
            3.  Export History: Add a small button to "Download History"
                which uses a small Python (Flask) micro-endpoint script
                (mocked or inline) or a Blob-based JS function to generate
                a .txt file of the session.

            Code Structure Requirements:
            -   HTML: Use data-attributes for JS targeting (e.g.,
                data-number, data-operation).
            -   CSS: Use CSS Variables for the color palette (Primary,
                Secondary, Accent, Background) to allow for easy theme switching.
            -   JS: Organize code into a Calculator class. Encapsulate the
                logic, UI updates, and storage handling.

            Deliverable: Provide the complete code in three distinct blocks:
            index.html, styles.css, and script.js. Ensure the code is heavily
            commented with "Senior Developer" insights explaining why certain
            architectural choices (like the Command Pattern) were made.
    -   Did well:   It did exactly what was asked of it. The frontend
                    was designed well, and the LLM output respective
                    JavaScript, HTML, and CSS files. The code it produced
                    was mostly bug-free.
    -   Did poorly: While testing the web application, I discovered a couple
                    errors: float division is incorrect for large numbers
                    and the "Undo", "Redo", and "Clear History" buttons
                    don't work. Also, an important feature I think was missing
                    was the ability to input negative numbers.
    -   In the next prompt, I specified these issues.

3.  Prompt: There are a couple of things that need work.
            1. When dividing large numbers, unwanted floating-point decimals exist.
            2. The "Undo" and "Redo" buttons do not work.
            3. The "Clear History" button does not work.
            4. Add a feature to give the user the ability to input negative numbers.

            Think like a senior engineer and consider any possible edge cases that
            would cause unwanted behavior. Provide details on where to make the
            code changes or where to insert new code.
    -   Did well:   It did mostly what was asked of it. There were a few missing
                    details that I caught.
    -   Did poorly: There were a few missing details that I caught: it didn't
                    produce a 'data-negate' button and didn't include event listener
                    logic for the 'undo' and 'redo' buttons.
    -   I specified to update these things in the next prompt. I made the next
        prompt shorter to reduce the context to try and get a more direct result.

4.  Prompt: Help me add the button 'data-negate', as well as event listener
            logic for undo and redo.
    -   Did well:   It did mostly what was asked of it.
    -   Did poorly: The only persisting bug left to fix is the floating-point
                    division issue.
    -   I gave a concrete example of the issue in the next prompt to provide
        more specific context with the goal of getting a direct fix.

5.  Prompt: The floating-point division is still incorrect for large numbers.
            Below is an example of what is happening. First, think about all
            the ways to solve this issue, then finalize on the best solution.
            Also, numbers ending in .0000 should remove the decimal.

            9^9 = 387420489 -> /9 = 43046720.99999999
    -   Did well:   It accomplished a working solution.
    -   Did poorly: Along with the correct solution, it provided already given
                    solutions from previous prompts.
    -   This was the last prompt I did, but in the future I would consider
        switching chats to remove history and only provide specific context
        for less hallucinations.
