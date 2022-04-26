# SolHunt

This README will serve as the documentation for this project. This document aims to clarify both the structure of the project and the purpose of its main files.

## Pages

This section wil give an overview of each Page (as found in the `pages` folder) and list any of its relevant functions if any.

Note that all the pages in this section must use the Page component as a wrapper for its contents.

### Home (index.js)

- <u>handleOpen():</u> Sets the state of the modal to false, so that the modal closes whenever necessary.
- <u>handleClose():</u> Sets the state of the modal to true, so that the modal opens whenever necessary.
- <u>submitRequestHandler(event):</u> Sends the book request to the database, under the requests collection, the book title and ISBN are saved.
- <u>checkAllFilled():</u> Checks if all fields in the book request form are filled, if they are enable the button so that submission can be completed, otherwise keep button disabled.
- <u>checkISBN():</u>Checks if the input ISBN in the book request is a valid ISBN.

### Login (login.js)

- Uses login() function from authProvider and logs the user according to the information provided.
- User is redirected to home page upon successful login.

### Sign Up (sign_up.js)

- Uses signup() function from authProvider and creates a user with information provided. Returns signup component
- User is redirected to home page upon successful signup.

### User Profile (userProfile.js)

This page gets information from the database based on the specified user's id using react methods and the user class created in userModel.js then returns it in a styled webpage using the styling in UserProfile.module.css

### Moderator (moderator.js)

- A page that will only be accessed by mods
- loadPopup is a function that is called once the mod clicks on a textbook they want to remove
  - It will take the book that got clicked and a Boolean value that will decide if the pop up should appear
- deleteBook is called once the mod clicks ‘Remove’ on the delete book pop up
  - It will set popupBtn to false, clear the bookResults from the search bar and delete the passed in book from the textbooks database
- searchHandler is called when the mod tries searching for a textbook to remove
  - Finds books depending on the text that the user inputs
- getRequests is responsible for getting all the requested books and uses
  setBooksRequested to store the books in booksRequested
- deleteRequest simply deletes the textbook request 'book'
- Allows the mod to update existing textbooks and add new textbooks

### Book (book/[bid].js)

- This page can only be accessed after selecting a textbook from the home page (unless you manually enter the uri)
- The `[bid]` route determines which textbook is being shown, where the route is `/book/[bid]`
- This page contains the view for navigating through the contents of a textbook to find a specific question

### Other User Profile (otherUserProfile/[username].js)
- This page can only be accesses after clicking on a username on the solutions page.
- The `[username]` route determines which user is being shown, where the route is `/otherUserProfile/[username]`
- This page contains the view for navigating through the information of a selected user to evaluate if the user's answer is reliable. 

### Solutions (solutions.js)

- This page can only be accessed by selecting a specific question from the Book page
- A query parameter is passed from the Book page to this page to determine which question's solutions are displayed
- This page shows all the existing solutions for the selected question and also provides a textbox for the user to submit a new solution

### Results (results.js)

- A page displaying all the textbooks that match the search query
- The matching books (which might be filtered further) are passed to ResultGrid

## Components

This section wil give an overview of each Component (as found in the `components` folder) and list any of its relevant functions if any.

### Navbar

- Navigation bar that will be present on every page to allow for easy navigation to the pages which are not tied to any a specific book id.
- The Navbar's items are based on the `navConfig.js` file
- getUser finds the user's document in the database and checks the user type

### Page

- Wrapper class for every single page in the `pages` folder.
- Ensures that every page has a Navbar.
- Can be used to set the spacing/width of any page.

### Popup

- Wrapper component that shows a pop up using the content from its child components
- Its visibility state is determined based on state from its parent (which this component will receive)

### RemoveBookPopup

- `Popup` component for a confirmation message when removing a book
- Uses the `visible` and `setVisible` props to make the 'remove' and 'cancel' buttons function as required

### Solution

- Contains the view for any single solution for a question
- Maintains a subscription to the solution its responsible for, to display real-time updates to the user

### Comments

- Contains the view for all the comments of any single solution
- Maintains a subscription to the comments sub-collection of its respective solution, to display real-time updates to the user

### ResultGrid

- A grid of all textbooks matching the search

### TextbookCard

- The view for how a textbook that shows up in the result grid looks like

### TextbookForm

- Form for adding/updating any field that pertains to a textbook's information or structure (ie. title, author, edition, chapter structure)
- Contains a recursive form which allows the moderator to add/update textbooks with as many levels of nesting as needed for each chapter of the textbook

### AddBook

- Uses the `TextbookForm` component to add a new textbook into the database

### EditBook

- Uses the `TextbookForm` component to update an existing textbook in the database

