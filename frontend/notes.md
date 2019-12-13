# MyWazza - store route schedules of Hungarian public transport for specific domestic destinations'

## Acceptance Criteria


General

        GIVEN I'm a User
        THEN I can use this application offline
        THEN I can use this application either in a browser (any device)


        GIVEN I'm a User
        WHEN I'm starting up the app
        THEN I can see a spinner until loaded
        THEN I land on the main page first


        GIVEN I'm a User
        THEN I can see a back to main page nav element on every page, except main page


        GIVEN I'm a User
        THEN I can see an icon indicating on/offline status


        GIVEN I'm a User
        WHEN first land on main page after startup
        AND I'm online
        AND server is accesible
        THEN I can see a modal if the application should
            - automatically attempt to refresh all stored routes
            - delete expired routes
            - perform / skip refresh as per user input given for this prompt
        THEN at the end the user land on main page


        GIVEN I'm a User
        WHEN first land on main page after startup
        AND I'm online
        WHEN I attempt to refresh all routes
        BUT server is accesible/in error/etc
        THEN I can see a modal that server is not accesibleand if the application should
            - retry the request
            - or delete/
            - keep expired routes
        THEN at the end the user land on main page


        GIVEN I'm a User
        WHEN first land on main page after startup
        AND I'm offline
        THEN I can see a modal if the application should
            - delete from cache/keep expired routes
        THEN at the end the user land on main page


Main page


        GIVEN I'm a User
        WHEN I'm on main page
        THEN I can see the following navigation links
            - Search
            - Saved Routes
            - Favourites
            - Refresh all (only if online)
            - Quit
            - About


Search Page


        GIVEN I'm a User
        WHEN I'm on Search page
        AND I'm online
        THEN I can enter a departure and destination city name
        THEN I can submit the request to query the route-s schedule


        GIVEN I'm a User
        WHEN I'm on Search page
        AND I'm online
        AND schedule query is submitted
        AND response is success
        THEN stored route schedule
            - if exists: updated automatically in the background
            - otherwise: I can see a modal offering 'Save route' or 'View only' options
        THEN I am navigated to a route schedule page - after choosing any of these options


        GIVEN I'm a User
        WHEN I'm on Search page
        AND I'm online
        AND schedule query is submitted
        AND response is error (any)
        THEN I can see a modal for error report with two nav options
            - offering search on the local store (same as offline case)
            - retry
            - I am navigated back to main page


        GIVEN I'm a User
        WHEN I'm on Search page
        AND I'm offline
        THEN I can see a warning that being offline and local stored routes will be searched
        THEN I can enter a departure and destination city name
        THEN I can submit the request to query the route-s schedule from local storage


        GIVEN I'm a User
        WHEN I'm on Search page
        AND I'm offline
        AND I submit the request to query the route-s schedule from local storage
        AND route entry exists, navigate to Route schedule page


        GIVEN I'm a User
        WHEN I'm on Search page
        AND I'm offline
        AND I submit the request to query the route-s schedule from local storage
        AND route entry does not exist, warn by a modal and navigate to search page


Route schedule page


        GIVEN I'm a User
        WHEN I'm on a selected Route schedule page
        THEN I can see a tappable list of the next upcoming 14 days
        THEN I can navigate back to Search page or Main page


        GIVEN I'm a User
        WHEN I'm on a selected Route schedule page
        AND I selected a day from the list
        THEN I can see the schedule entry for that day on the particular route


        GIVEN I'm a User
        WHEN I'm on a selected Route schedule page
        AND I selected a day from the list
        AND I see the schedule entry for that day on the particular route
        AND I am online
        THEN I see a enabled control to trigger update for this route from the server


        GIVEN I'm a User
        WHEN I'm on a selected Route schedule page
        AND I selected a day from the list
        AND I see the schedule entry for that day on the particular route
        AND I am offline
        THEN I see a disabled control to trigger update for this route from the server


        GIVEN I'm a User
        WHEN I'm on a selected Route schedule page
        AND I selected a day from the list
        THEN I can navigate back to day's list
        THEN I can navigate back to the page from where I arrived to Route schedule page (Saved routes or Search page)


Saved routes' page

        GIVEN I'm a User
        WHEN I'm on Saved Routes page
        THEN I can see a search field and a search button
        THEN I can see a list of saved searched beneath the input controls
        THEN I search saved routes by partial string match in their names
        THEN I can see a filtered list of results

        GIVEN I'm a User
        WHEN I'm on Saved Routes page
        WHEN I perform a search
        WHEN I click on a search result item
        THEN I am navigated to route schedule page of the selected route

        GIVEN I'm a User
        WHEN I'm on Saved Routes page
        WHEN I performed a search
        WHEN I long tap the item
        THEN I see a yes/do modal: do you really want to delete this route
        THEN if answered yes, it deletes the saved route
        THEN I see the filtered list of saved routes again



---------------------
TODO: Fav, Quit, About pages
