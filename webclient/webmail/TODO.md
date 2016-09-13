[ ] key events hash on view
[ ] storage hash for resources on view
[ ] scroll up refreshed list
[ ] scroll down fetches next page (need to fix current implementation w/ button)
[ ] fix weird/instant list view before fetch
[ ] data-action tags call methods directly on the resource (see next item)
[ ] think about specifying resource in data-resource tag and have arch handle instancing and wiring it all up
[ ] attribute data-bind and have arch wire it up with the resource
[ ] good, thoughtful thread and message body parsing and display
[ ] Fix html so that actions are in the same html as its page (fixes a a much larger: view structure should be independent of the html structure)
[ ] Better loader at top of the page that any module can use
[ ] backbone adds the extra wrapper div in the view just in case there is no root div in the template so... need to allow backbone to do that so i dont have to code my own div tag all th time
[ ] need to refresh gauth token
[ ] infinite scrolling
[ ] pull up to refresh