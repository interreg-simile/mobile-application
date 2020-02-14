## ToDo

- Write and set up API documentation.

- Add right status code if route exists but verb is not allowed.

- Explore response types (GeoJSON).

- Use numbers instead of rois and countries (events + alerts).

- Modify all the validation to be functions..


#### Auth

- Handle users


##### Events

- Add the possibility to query by uid.

- Ensure that only an admin or the user who made the event can modify it.

- Allow patch sub-values.
    - Validate sub-values in patch.

- Add photos after the event is completed.
    - How long is the admin allowed to add photos?
    - Add the user who created the event (only him is allowed to add photos?).
    - How long will the "updated" event be visible on the map?


##### Alerts

- Add the possibility to query by uid.

- Ensure that only an admin or the user who made the alert can modify it.

- Allow patch sub-values.
    - Validate sub-values in patch.
    
    
##### Observations

- Expiration date?

- Try to remove dPath from returned objects.

- Test if set description works with arrays.
