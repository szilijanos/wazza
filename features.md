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
        THEN I can see a modal that server is not accesible and if the application should
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

        GIVEN I'm a User on main page
        THEN I can see the following navigation links
            - Search
            - Saved Routes
            - Favourites
            - Refresh all (only if online)
            - About


About modal

        GIVEN I'm a User on main page
        WHEN I click on 'About'
        THEN I can see a closable only modal with app details, version and credits


        GIVEN I'm a User
        WHEN I see the 'About' modal
        AND I either click or nav back
        THEN I return to main page


Search Page

        GIVEN I'm a User on Search page
        AND I'm online
        THEN I can enter a departure and destination city name
        THEN I can submit the request to query the route-s schedule


        GIVEN I'm a User on Search page
        AND I'm online
        AND schedule query is submitted
        AND response is success
        THEN route schedule fetching shall be attempted
        AND as per the particular current state of the application (see below) action options are provided to the user (see below)
        THEN After the action I am navigated to a route schedule page - after choosing any of these options


        GIVEN I'm a User on Search page
        WHEN I attemted to a request to fetch route details successfuly
        AND if stored route schedule is already saved
        THEN it is updated automatically in the background


        GIVEN I'm a User on Search page
        WHEN I attemted to a request to fetch route details successfuly
        AND if stored route schedule is not saved
        AND there are free save slots:
        THEN I can see a modal offering 'Save route' or 'View only' options


        GIVEN I'm a User on Search page
        WHEN I attemted to a request to fetch route details successfuly
        AND if stored route schedule is not saved
        AND there are no more free save slots:
        THEN I can see a modal warning not having more slots, and offering 'Replace a save route from slot and store' or 'View only' options


        GIVEN I'm a User on Search page
        WHEN I attemted to a request to fetch route details successfuly
        AND I selected 'View only'
        THEN it should navigate to Route schedule page with that newly saved route details opened
        THEN I can see a warning icon that the route is not saved


        GIVEN I'm a User on Search page
        WHEN I attemted to a request to fetch route details successfuly
        AND I selected 'Save route'
        THEN it should save the route to cache and navigate to Route schedule page with that newly saved route details opened
        THEN I can see a confirm icon that is saved to cache


        GIVEN I'm a User on Search page
        WHEN I attemted to save a route
        AND I selected 'Replace route'
        THEN it should navigate to Stored routes page
        BUT When clicking an item in the list it should show a modal to 'replace' saved route, or 'View new only'
        THEN after the selected action is performed it should navigate to route schedule page, either replaced or viewed
        THEN I can see a warning icon if the route is not saved, and a confirm icon if it is saved


        GIVEN I'm a User on Search page
        WHEN I'm online
        AND schedule query is submitted
        AND response is error (any)
        THEN I can see a modal for error report with two nav options
            - offering search in the local store (same as offline case)
            - retry
            - I am navigated back to main page


        GIVEN I'm a User on Search page
        WHEN I'm offline
        THEN I can see a warning that being offline and local stored routes will be searched
        THEN I can enter a departure and destination city name
        THEN I can submit the request to query the route-s schedule from local storage


        GIVEN I'm a User on Search page
        WHEN I'm offline
        AND I submit the request to query the route-s schedule from local storage
        AND route entry exists, navigate to Route schedule page


        GIVEN I'm a User on Search page
        WHEN I'm offline
        AND I submit the request to query the route-s schedule from local storage
        AND route entry does not exist, warn by a modal and navigate to search page upon close or back nav.


Route schedule page

        GIVEN I'm a User on a selected Route schedule page
        THEN I can see a tappable list of the next upcoming 14 days (actually a 2 x 7 grid or a calendar widget would look better, but let's not overengineer this stuff at first pass :) )
        THEN I can navigate back to Search page or Main page (from where I arrived here)

        GIVEN I'm a User on a selected Route schedule page
        WHEN I selected a day from the list
        THEN I can see the schedule entry for that day on the particular route


        GIVEN I'm a User on a selected Route schedule page
        WHEN I selected a day from the list
        AND I see the schedule entry for that day on the particular route
        AND I am online
        THEN I see a enabled control to trigger update for this route from the server


        GIVEN I'm a User on a selected Route schedule page
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

        GIVEN I'm a User I'm on Saved Routes page
        THEN I can see a search field and a search button
        THEN I can see a list of saved searched beneath the input controls
        THEN I can have maximum 20 saved route in cache a time


        GIVEN I'm a User I'm on Saved Routes page
        WHEN I search saved routes by partial string match in their names
        THEN I can see a filtered list of results
        THEN I can see 2-s CTA within the line of the to perform these actions on the item: Add to favourites, delete item


        GIVEN I'm a User I'm on Saved Routes page
         AND I selected to delete an item
        THEN I see a yes/do modal: do you really want to delete this route
        THEN if answered yes, it deletes the saved route and shows the updated filtered list of saved routes items
        THEN I see the filtered list of saved routes again


Favourites page

        GIVEN I'm a User I'm on Favourites page
        THEN I can see the same search field and a search button as on saved routes
        THEN I can see a list of favourites beneath the input controls


        GIVEN I'm a User I'm on Favourites page
        WHEN I search favourite routes by partial string match in their names
        THEN I can see a filtered list of results


        GIVEN I'm a User I'm on Favourites page
        WHEN I search favourites by partial string match in their names
        THEN I can see a filtered list of results
        THEN I can see 2-s CTA within the line of the to perform these actions on the item: Add to fetch item, delete item from favorites


        GIVEN I'm a User I'm on Favourites page
        WHEN I attempt to fetch route item
        AND there is no data saved (or have been cleaned) for that route
        THEN I see a modal to attempt to fetch the route data or cancel (back to fav's page)


        GIVEN I'm a User I'm on Favourites page
        AND I attempted to fetch new route data
        THEN I am navigated to search page and continue with the same logic, as if I attempted the fetching of route from there


        GIVEN I'm a User I'm on Favourites page
         AND I attempted to delete an item
        THEN I see a yes/do modal: do you really want to delete this route from favorites
        THEN if answered yes, it deletes the item from the fav's shows the updated filtered list
        THEN I see the filtered list of favourite routes again