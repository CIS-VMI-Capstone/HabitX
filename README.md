# Bad Habits App
Jeffery Cheeseman, Cambden Hadley, James Jeffers<br>
Team Habit Breaker<br>
Department of Computer and Information Systems, Virginia Military Institute<br>
CIS-480 Pre-Capstone - Fall 2025<br>
12/09/2025<br>

## 1.0 Proposal
### 1.1 Concept Statement
Our app guides users on a personal journey toward self-improvement, transforming harmful habits into positive change through mindful tracking, meaningful insights, and consistent support
### 1.2 Context
Essientially we are looking to create a app that helps you quit bad habits and tracks your progress with a streak like duolingo. With this app we are ideally hoping to include
a cart system that will give you reccomended purchases that help you quit. For example, if your are trying to quit Zyns nicotine then the app can reccomend you mints or gum
to buy. <br>
We want to have a frontend that is done using: HTML, REACT, and JSX<br>
We want to have a backend that is done using: Python, and an API such as FastAPI<br>
Most of the challenge with creating this app should mainly come from the Sprint where we do our Cart and the Sprint where we do the streak system.

### 1.3 Required Capabilities
For our required capabilities we are looking for our app to include (ranked top to bottom from realisim): <br>
1. Motivational Quote Notifications<br>
2. Social Support System<br>
3. Streak System<br>
4. Shopping Cart<br>
5. Integration with Other Apps<br>

### 1.4 Expected Outcome of Implementation
The expected outcome of the implementation for our app is, to have an app that can discretely or openly bring together a group of people with similar 
habbits they are hoping to quit. Through this app they will be able to share a common goal of hoping to quit; With the Social Support System we are hoping to implement,
people will be able to communicate on products or other things that were able to help them quit that the Cart might not be able to mention.
<br>
<br>
<br>
Overall, this app should be helping people quit and track their progress quitting while motivating and helping them along this journey.

### 2.0 Requirements and User Stories
### 2.1 Required Functionality
For the required functionality, our project at its basics must be able to:<br>
1. Have a add feature that adds your habit you wish to quit<br>
2. Track this habit and your daily progress towards quitting<br>
3. Have an AI chatbot that will reccomend products that direct you to Amazon to buy them<br>
4. Send you daily motivational quotes to keep you in high spirit while quitting.<br>
5. Have the app visibly and pleasing to use for user. <br>

### 2.2 User Stories
As a registered user, I want to quit an addiction using TheHabitTracker so that I can live an improved and healthier life. When I feel like relapsing on an addiction I am trying to quit, I can click a panic button, which can call a trusted person I know, or receive an AI-generated Motivational text that keeps me from relapsing. As a registered user, I will have access to how long I have kept my good habits, so that I can use it as motivation to not fall back into bad habits. When I add a bad habit I want to quit, like quitting nicotine, TheHabitTracker will give me a questionnaire on what form of nicotine I've been using, how long, and why. Then, it will use AI queries to give me better alternatives to the products, and tips to help me quit depending on how long I have been using them and why I've been using that product. As a registered user, I want to have videos of other people who have maintained similar habits to me, so that I understand that I am not alone in this struggle. As a registered user, I want to have a reward of some kind when I've successfully maintained a good habit for a certain time limit so that there is more of a reward to maintaining good habits.

### 2.3 User Personas
Alex, 36, bachelor’s in chemistry, chemical engineer, born and raised in Massachusetts, spent 4 years at MIT graduated with a 3.8 GPA, 10 years of experience with chemical engineering, multiple certifications like the following PE, ASQ, CCE, EHS. Need an outlet to stop me from using nicotine products to deal with stress during and after work hours. Nicotine has taken time from my personal life through distractions with addiction.<br>
<br>
Ronald, 55, master’s in business, Finance manager for USAA bank position at Richmond VA, lived in Fredericksburg until 1994, Studied at the University of Richmond. Been working At USAA for the past 12 years. I struggle with overeating, and it has affected my work ethic because I always feel unmotivated due to my weight.<br>
<br>
Tiffany, 42, bachelor’s in biology, CVS pharmacy Technician, worked at CVS for the past 7 years, I have constant memory and work-related issues due to my lack of sleep, I cant get tired enough during the day and lay awake through most nights.

### 2.4 Non-functional Requirements
#### 2.4.1 Security
We plan to inplement a security system with multiple factors like authentification to ensure only the allowed users are allowed to see the what the habits the user has entered the progress made and other users who are on the contact/authorized personel list to edit or view data. Some methods of security we plan to use includes two factor authentification for every login, as well as a password protected section to view very personal information. For GDPR and HIPAA, HIPAA wont apply due to the lack of medical information being used within the application and it all being purely interactable, but GDPR will play into effect for our oversea users as we will only store data provided to us and this data will be stored and only accessible for the users and noone else ensuring limited access to data and an increase to overall privacy.

#### 2.4.2 Performance
Performance should be very fast since this is a mobile app and should not contain as much code as many other bigger projects would. To make performance even faster we plan to implement GeminiAI to help with our 
Motivational Quote system, our Chatbot, and mainly our Streak System.

#### 2.4.3 Availability
We want this app to be free to everyone; This app is designed to help you quit those bad habits and no one should need to pay to quit bad habits. Later on the line other features may be added to have in-app purchases for maybe no adds or something but other than that everyone should be able to enjoy our app.

#### 2.4.4 Reliability
Our app will be very reliable with reverse proxy being done to have a constant server and fallback options up. The only time the app shall be down is for scheduled rolling updates that 
will occur when there are the least amount of users on the app (2-5AM) most likeley.

#### 2.4.5 Ethics and Sustainability
There will be no bias in any of the algorithms considering this app is strictly to help people. User consent will not be required since it is completely optional for the user to submit their infor for help or not. There should be no data really needing to be kept, this app should be sufficient just via user input.

### 3.0 Technical Specifications and Design
### 3.1 Design
Our main core design prinicple will be:<br>

Balance: Using balance we will be focusing on making the app visually apealing with everything perfectly spaced out and align. This will give the user mushc more enjoyment the app rather than it just being an 'eye-sore'. With balance we also allow the user to navigate much easier allowing them to switch between their differnt 'tabs' and 'redirection' screens. With balance we can bring in the other subcategories such as allignment and proportion. These will mainly be done in the css style and if anything is directly needed only once for that single line then it will be 'in-line' styling<br>
<br>
This core principle will as mentioned before allow the user to naigate the app much easier. This leads to a greater rating and more time spent on the app which can then lead to sponors and so on. If sponsors are able to be obtained this will give us the oppurtunity to make drastic changes to the app in security enhancements and better UI upgrades.<br>
<br>
Our project as mentioned above will be a mobile app. There are actually mobile programming applications that allow this to be done much easier than a normal vscode full- stack applicaiton.

### 3.2 Architecture Approach
For our architecture approach we plan to use a Client-Server Architechture.<br>
<br>
Client(Mobile App)<br>
<br>
1.Cross-Platform using REACT w/ HTML as mentioned previously<br>
2.Database of local storage for offline access(SQLite)<br>
3.POSSIBLY...a sync layer to communicate with backend(REST API)<br>
<br>
Backend(Cloud)<br>
<br>
1.Python(FastAPI)<br>
2.API Gateway + Authentication<br>
3.Data Processing for habbit patterns<br>

### 3.3 Software Solution
This Software solves the problem of:<br>
<br>
People always are eager to break bad habits but..<br>
- They lack consistent training<br>
- They don't see progress clearly<br>
- They often give up without support or insights

### 4.0 Implementation Plan
### 4.1 Delivery Roadmap
Sprint 1 – Initial Thought Processing / Brainstorming (Feb 14th)<br>
Sprint 2 – Work on Initial Coding to Create a Rough Idea (Feb 28th)<br>
Milestone 1 – Rough Idea of a Working Habit Tracking App (March 7th)<br>
Sprint 3 – Continue Development of App (March 21st)<br>
Milestone 2 – Finalization of App (April 4th)<br>
Testing – Test App Making sure Everything Runs Perfect (April 11th)<br>
Milestone 3 – Completion and Presentation of App (By due date in late April - early May)<br>

(Completed by set dates)

### 4.2 Testing
- The testing for our project will be fairly simple, yet it will ensure all functions and requirements are working properly.<br>
- Automated unit testing: There will not be an automated unit test, as automating testing while the project is running would be a waste of CPU power and would not be needed. Instead, we will manually test the code, with a team member in charge of testing all project functions.<br>
- User Testing: Regarding user testing, there will be user testing, and we plan to find a random person who would like to use it at school. The user test will be a week long, and they will give a review.<br>
- Performance Testing: For performance testing, we will first do speed and storage tests on the backend and the front end, and then manual testing. Regarding security testing, there will not be heavy testing, just authentication.<br>

### 4.3 Foreseeable Risks
With the creation of our application we need to worry about the possible security issues that come with the sensitive information like one’s name, friends and personal information like and the use of substances and other bad habits someone could dislike. We need to ensure that users information will be secured, confidential, and won’t be accessed through other users or even possible infiltrators. Another possible risk would be data storage as we want to have the information saved for each user and each login be unique to ensure privacy. Overall, our main concern with application and user security is authentication and confidentiality on the app. While taking authentication into account, we want to possibly make a two factor authentication with the users email address or their phone number at the user’s discretion. While taking confidentiality and privacy into account, we will possibly implement a sandbox version of AI for better confidentiality assurance and we will not use the users information unless we are authorized to.

### 4.3.1 Technical Risks
The only issue is that non of the members have made an application before so it is new to all of us, besides the lack of experence we are very confident that all the planned goals will be met.

### 4.3.2 Resource Risks
None risk on the team side, we luckily have to work for grade so we are "pushed" to always work together and will not have any loss of members, for our funds the only big financial impact is having a live server and app rights to ensure our product is secure, active, and protected. Due to our project being more on the digital side we can run everything off of a single device but for further implementation and expansion of the product we would need dedicated servers to run the code that allows the app services to stay available at all times.

### 4.3.3 External Dependencies
We are using an AI source to get fast results so the only issues that comes with the use of AI is if they update the AI model which will cause dependency issues. The simple sulution would just be to update the AI model on our end but if we do not detect the dependency fast enough it could cause reliability issues and possibly do alot of harm for the user end by giving the wrong information.

