DAVID WELLS
Earthquake Finder Website

  Website located at:  http://earthquakes.parseapp.com

  1. Takes input: location name (example: San Francisco, CA)
  2. Calls GeoNames recent earthquake WebService
  3. Plots results on a Google Map.  
  Each marker displays details of the earthquake when mouse is hovered over marker.

  Bonus:
  4. Lists top 10 largest earthquakes in the world.
  Original requirement: display earthquakes from last 12 months.
  I have the top 10 earthquakes listed on the page, however there is no parameter 
  on GeoNames webservices allows for retrieving results limited to the last year.
  I am getting the maximum allowed rows to be returned (500 earthquakes), and even with
  the optional date parameter was unable to get the service to return results from specifically
  the past year.  
  With more time I could implement a work-around.  
  One possible solution could be to continually hit the web service and store results
  in an array with the condition that they must be within the past year, and then sort.
  Upon request, I can finish attempting this bonus implementation.


Project uses Bootstrap (http://getbootstrap.com/) for css styling.
Html and Javascript for the rest.  (Some jQuery as well.)
index.html and quakes.js are the files I implemented.
