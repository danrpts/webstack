# app
- [ ] Persist task list changes across all open clients in the same browser

# arch
- [ ] Pushstate server modifications
- [ ] Research and implement testing techniques
- [ ] Research "orthogonal state" (https://youtu.be/UAl_N62gKmM?t=22m11s)
- [ ] Config objects (debug settings and more)
- [ ] File and variable naming cleanup
- [ ] Presenter class with custom methods per view
- [ ] Use UI event helpers in view (isEnter, etc...)
- [ ] Research and consider Polymer integration

# auth
- [ ] Support more OAuth2 provider and properly brand (easy after next items are completed)
- [ ] Fully integrate promises w/ view sync-fetch logic and view event system (difficult, see next items)
- [ ] Enitity promises fire events on views (see next item)

# data
- [ ] Data hierarchy for handler lookups
-- Instance <--> Local Storage <--> Server
-- Use backbone.localStorage as a cache (cachedFetch(), cachedSync())
-- Develop data coherency protocol

# compositing
- [ ] Look for memory leaks, zombie views (views still listening to events)
- [ ] Print view id in rendered templates (using debug object)
